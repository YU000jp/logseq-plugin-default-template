import '@logseq/libs' //https://plugins-doc.logseq.com/
import { AppGraphInfo, BlockEntity, PageEntity } from '@logseq/libs/dist/LSPlugin.user'
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import { advancedDefaultTemplate } from './advancedDefaultTemplate'
import { addCommandPaletteCommands } from './commands'
import { msgWarn } from './msg'
import { settingsTemplate } from './settings'
import ja from "./translations/ja.json"

export let currentGraphName = "" // 現在のgraph名を保持する

export const getCurrentGraph = async (): Promise<string> => {
  const userGraph = await logseq.App.getCurrentGraph() as { name: AppGraphInfo["name"] } | null
  if (userGraph) {
    console.log("currentGraph", userGraph.name)
    currentGraphName = userGraph.name // 現在のgraph名を保持
    return userGraph.name
  } else {
    currentGraphName = "" // demo graphの場合は空文字
    console.warn("getCurrentGraph failed or the demo graph")
    return ""
  }
}


// 処理中フラグ
let processing = false

/* main */
const main = async () => {

  // l10n
  await l10nSetup({ builtinTranslations: { ja } })

  // コマンドパレットにコマンドを追加
  addCommandPaletteCommands()

  logseq.provideStyle(`
    div[data-id="logseq-plugin-default-template"] textarea {
      min-height: 5em;
    }
    `)

  // graph変更時の処理
  logseq.App.onCurrentGraphChanged(async () => {
    await loadByGraph()
  })

  // 初回読み込み
  await loadByGraph()


  //ページ読み込み時に実行コールバック
  logseq.App.onRouteChanged(async ({ template }) => {
    if (template === '/page/:name')
      whenCreateNewPage()
  })

  //Logseqのバグあり。動作保証が必要
  logseq.App.onPageHeadActionsSlotted(async () => {
    whenCreateNewPage()
  })

}/* end_main */


const whenCreateNewPage = () => {
  // 処理中の場合は実行しない
  if (processing) return
  processing = true
  setTimeout(async () => {

    setTimeout(() => { processing = false }, 5000) // 5秒後に解除

    // demo graphの場合は実行しない
    if (currentGraphName === "")
      return console.warn("currentGraphName is empty or demo graph")

    // 現在のページのブロックツリーを取得
    const blockTree = await logseq.Editor.getCurrentPageBlocksTree() as { uuid: BlockEntity["uuid"], content: BlockEntity["content"] }[]
    // 1行のみだった場合は処理を行う
    if (blockTree.length === 1) {
      const block = blockTree[0]
      // ブロックの内容が空の場合はテンプレートを挿入
      if (block.content === "" // 空文字の場合
        || block.content === null
        || block.content === "nil") {

        //console.log("blockTree", block)
        const currentPageEntity = await logseq.Editor.getCurrentPage() as { originalName: PageEntity["originalName"], journal?: PageEntity["journal?"] } | null
        if (currentPageEntity === null)
          return console.warn("currentPageEntity is null")

        if (currentPageEntity["journal?"] === true) {
          // 日記のシングルページの場合
          console.log("journal page: " + currentPageEntity.originalName)
          const journalTemplate = logseq.settings![currentGraphName + "/journalTemplateName"] as string
          const checkUserSettings: boolean = await checkTemplateNameForJournal(journalTemplate) // テンプレート名が設定されているか、そのテンプレート名が有効かどうかチェック
          if (checkUserSettings === false)
            return // チェックによって処理を中断
          await insertTemplateAndRemoveBlock(block.uuid, journalTemplate)// テンプレートを挿入

        } else {
          // ジャーナル属性でない場合

          if (logseq.settings![currentGraphName + "/advancedStartWith"] !== ""
            || logseq.settings![currentGraphName + "/advancedContain"] !== ""
            || logseq.settings![currentGraphName + "/advancedEndWith"] !== "") {

            // Advanced Default Templateが設定されている場合
            advancedDefaultTemplate(block.uuid, currentPageEntity.originalName)

          } else
            // Advanced Default Templateが設定されていない場合
            defaultTemplate(block.uuid)
        }
      } else
        console.log("blockTree[0].content is not empty or nil. Skip processing.")
    } else
      if (blockTree.length === 0) { // ブロックがない場合
        console.warn("blockTree.length is 0.")

        const journalTemplate = logseq.settings![currentGraphName + "/journalTemplateName"] as string
        const checkUserSettings: boolean = await checkTemplateNameForJournal(journalTemplate) // テンプレート名が設定されているか、そのテンプレート名が有効かどうかチェック
        if (checkUserSettings === false)
          return // チェックによって処理を中断

        // ジャーナル属性の場合は、続行する
        const currentPageEntity = await logseq.Editor.getCurrentPage() as { uuid: PageEntity["uuid"], originalName: PageEntity["originalName"], journal?: PageEntity["journal?"] } | null
        if (currentPageEntity === null)
          return console.warn("currentPageEntity is null")
        if (currentPageEntity["journal?"] === true) {
          // 日記のシングルページの場合は、強制的にテンプレートを挿入する
          console.log("journal page (no block): " + currentPageEntity.originalName)
          const newBlockEntity = await logseq.Editor.appendBlockInPage(currentPageEntity.uuid, "") as { uuid: BlockEntity["uuid"] } | null // 空のブロックを追加
          if (newBlockEntity === null)
            return console.warn("newBlockEntity is null" + currentPageEntity.originalName)
          else
            await insertTemplateAndRemoveBlock(newBlockEntity.uuid, journalTemplate) // 作成したブロックにテンプレートを挿入
        } else {
          // ジャーナル属性でない場合は、設定によりブロックを追加する
          
        }

      }
  }, 800) // 0.8秒後に遅延実行 ※WeeklyJournalなどのほかのプラグイン対策
}

const checkTemplateNameForJournal = async (journalTemplate: string): Promise<boolean> => {
  // テンプレート名が設定されていない場合は処理しない
  if (journalTemplate === "") {
    console.warn("journalTemplate is empty (Completion of journal template)")
    return false
  } else {
    if (await logseq.App.existTemplate(journalTemplate) === false) {// テンプレートが存在しない場合は処理しない
      msgWarn(t("Template not found."), "(Completion of journal template)") // 警告を表示
      return false
    }
    return true
  }
}


export const defaultTemplate = async (blockUuid: BlockEntity["uuid"]) => {
  // テンプレートが設定されていない場合は処理しない
  const templateName = logseq.settings![currentGraphName + "/defaultTemplateName"] as string
  if (templateName === "")
    return

  // テンプレートが存在しない場合は処理しない
  if (await logseq.App.existTemplate(templateName) === false) {
    msgWarn(t("Template not found."), "") // 警告を表示
    return
  }

  // テンプレートを挿入
  await insertTemplateAndRemoveBlock(blockUuid, templateName)
}


export const insertTemplateAndRemoveBlock = async (blockUuid: BlockEntity["uuid"], templateName: string) => {

  await logseq.App.insertTemplate(blockUuid, templateName)
  setTimeout(async () => {
    const block = await logseq.Editor.getBlock(blockUuid) as { content: BlockEntity["content"] } | null
    if (block === null
      || block.content !== "")
      return
    else
      await logseq.Editor.removeBlock(blockUuid) // テンプレート挿入後は空のブロックを削除
  }, 300)
  logseq.UI.showMsg(t("Template inserted."), "info", { timeout: 3000 })
}


const loadByGraph = async () => {
  const currentGraphName = await getCurrentGraph()
  if (currentGraphName === "")
    return // demo graphの場合は実行しない
  else {
    logseq.useSettingsSchema(settingsTemplate(currentGraphName)) /* user settings */
    setTimeout(() => {
      if (!logseq.settings) logseq.showSettingsUI()
    }, 300)
  }
}

logseq.ready(main).catch(console.error)