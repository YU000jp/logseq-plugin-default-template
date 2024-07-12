import '@logseq/libs' //https://plugins-doc.logseq.com/
import { AppGraphInfo, BlockEntity, LSPluginBaseInfo, PageEntity } from '@logseq/libs/dist/LSPlugin.user'
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import { advancedDefaultTemplate } from './advancedDefaultTemplate'
import { addCommandPaletteCommands } from './commands'
import { insertTemplateAndRemoveBlock } from './lib'
import { msgWarn } from './msg'
import { settingsTemplate } from './settings'
import ja from "./translations/ja.json"
import { flagKeyLastOpenedAt, toggleLastOpenTimeInsertion, toolbarButtonForLastOpenedAt } from './toolbar'
import { keyLastOpenedAt } from './toolbar'
import { footPrint } from './footPrint'

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

  // スタイル適用
  logseq.provideStyle(`
  /* ページの最後に開いた時刻を示すプロパティ。オフの時にクラスが付く */
  body.${flagKeyLastOpenedAt} a#defaultTemplateLastOpenedAt {
    outline: 4px double red;
    outline-offset: -6px;
  }
  body:not(.${flagKeyLastOpenedAt}) a#defaultTemplateLastOpenedAt {
    outline: 4px double green;
    outline-offset: -6px;
  }
  /* プラグイン設定トグル */
  div[data-id="logseq-plugin-default-template"]{
    & div.heading-item {
    margin-top: 4em;
    }
    & span.edit-file+div.heading-item {
      margin-top: 2em;
    }
    & textarea {
      min-height: 5em;
    }
    & div.desc-item {

      &[data-key="insertCreateDateToDefault"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="createdAtPropertyName"] {
          display: none;

          &+div.desc-item[data-key="createdAtPropertyFormat"] {
              display: none;

          }
      }
      
      &[data-key="footPrint"]:has(input.form-checkbox:not(:checked))+div.desc-item[data-key="lastOpenedAtPropertyName"] {
          display: none;

          &+div.desc-item[data-key="lastOpenedAtPropertyFormat"] {
              display: none;

              &+div.desc-item[data-key="lastOpenedAtExcludesPages"] {
                  display: none;

                  &+div.desc-item[data-key="lastOpenedAtExcludesPagesStartWith"] {
                      display: none;
                      
                      &+div.desc-item[data-key="lastOpenedAtExcludesPagesContain"] {
                          display: none;

                          &+div.desc-item[data-key="lastOpenedAtExcludesPagesRegex"] {
                            display: none;
                          }
                      }
                  }
              } 
          }
      }
    }
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


  /* For Last Opened At Property */
  toolbarButtonForLastOpenedAt() // ツールバーにボタンを追加
  // クリックイベント
  logseq.provideModel({
    // keyLastOpenedAtボタン
    [keyLastOpenedAt]: () =>
      //現在の状態に基づいて、機能をトグルする
      logseq.updateSettings({ footPrint: logseq.settings!.footPrint as boolean === true ? false : true })
    ,
  })
  // 初回読み込み時の処理
  toggleLastOpenTimeInsertion(logseq.settings!.footPrint as boolean, { msgOff: true }) // 初回読み込み時のみメッセージを表示しない
  // プラグイン設定変更時
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (newSet.footPrint !== oldSet.footPrint)
      toggleLastOpenTimeInsertion(newSet.footPrint as boolean)

    //createdAtPropertyNameやlastOpenedAtPropertyNameの変更時に、それらに半角スペースや「:」が含まれている場合は警告を表示
    if (
      (newSet.createdAtPropertyName !== oldSet.createdAtPropertyName
        && ((newSet.createdAtPropertyName as string).includes(" ")
          || (newSet.createdAtPropertyName as string).includes(":")))
      || (newSet.lastOpenedAtPropertyName !== oldSet.lastOpenedAtPropertyName
        && ((newSet.lastOpenedAtPropertyName as string).includes(" ")
          || (newSet.lastOpenedAtPropertyName as string).includes(":")))
    ) msgWarn(t("The property name cannot contain half-width spaces or \":\"."), "")
  })
  // ページメニューコンテキストに、メニューを追加
  logseq.App.registerPageMenuItem(`⚓ ${t("Add to exclusion list of lastOpenedAt")}`, async () => pageMenuClickAddToExclusionList())
  /* end For Last Opened At Property */


}/* end_main */




// ページメニューコンテキストのメニューがクリックされた時の処理 (ページ名を除外リストに追加)
const pageMenuClickAddToExclusionList = async () => {
  {
    // logseq.settings!.lastOpenedAtExcludesPagesは空か、複数行でページ名が記入されていて、そこに重複しなければページ名を追加する
    const currentPageEntity = await logseq.Editor.getCurrentPage() as { originalName: PageEntity["originalName"] } | null
    if (currentPageEntity) {
      const pageName = currentPageEntity.originalName
      const excludesPages = logseq.settings!.lastOpenedAtExcludesPages as string
      if (excludesPages === "") {
        logseq.updateSettings({ lastOpenedAtExcludesPages: pageName })
      } else
        if (excludesPages !== pageName
          && !excludesPages.split("\n").includes(pageName)) {
          logseq.updateSettings({ lastOpenedAtExcludesPages: excludesPages + "\n" + pageName })
          logseq.UI.showMsg(t("Added to exclusion list of lastOpenedAt."), "success", { timeout: 3000 })
        }
        else {
          console.warn("This page is already included.")
          logseq.UI.showMsg(t("This page is already included."), "warning", { timeout: 3000 })
        }
    } else
      console.warn("currentPageEntity is null.")
  }
}



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
    const blockTree = await logseq.Editor.getCurrentPageBlocksTree() as { uuid: BlockEntity["uuid"], content: BlockEntity["content"], properties: BlockEntity["properties"] }[]
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
          // テンプレート名が設定されているか、そのテンプレート名が有効かどうかチェック
          if ((await checkTemplateNameForJournal(journalTemplate)) as boolean === false)
            return // チェックによって処理を中断
          await insertTemplateAndRemoveBlock(block.uuid, journalTemplate, { journal: true })// テンプレートを挿入
        } else
          // ジャーナル属性でない場合
          if (logseq.settings![currentGraphName + "/advancedStartWith"] !== ""
            || logseq.settings![currentGraphName + "/advancedContain"] !== ""
            || logseq.settings![currentGraphName + "/advancedEndWith"] !== "")
            advancedDefaultTemplate(block.uuid, currentPageEntity.originalName)// Advanced Default Templateが設定されている場合
          else
            defaultTemplate(block.uuid, currentPageEntity.originalName)// Advanced Default Templateが設定されていない場合
      } else
        console.log("blockTree[0].content is not empty or nil. Skip processing.")
    } else
      if (blockTree.length === 0) { // ブロックがない場合
        console.warn("blockTree.length is 0.")

        const journalTemplate = logseq.settings![currentGraphName + "/journalTemplateName"] as string
        // テンプレート名が設定されているか、そのテンプレート名が有効かどうかチェック
        if ((await checkTemplateNameForJournal(journalTemplate)) as boolean === false)
          return // チェックによって処理を中断

        const currentPageEntity = await logseq.Editor.getCurrentPage() as { uuid: PageEntity["uuid"], originalName: PageEntity["originalName"], journal?: PageEntity["journal?"] } | null
        if (currentPageEntity === null)
          return console.warn("currentPageEntity is null")

        if (currentPageEntity["journal?"] === true // ジャーナル属性の場合は、続行する (日記のシングルページの場合は、強制的にテンプレートを挿入する)
          || logseq.settings!.insertTemplateIfPageEmpty as boolean === true // ジャーナル属性でない場合は、ユーザー設定によりブロックを追加する
        ) {
          console.log("no block page: " + currentPageEntity.originalName)
          const newBlockEntity = await logseq.Editor.appendBlockInPage(currentPageEntity.uuid, "") as { uuid: BlockEntity["uuid"] } | null // 空のブロックを追加
          if (newBlockEntity === null)
            return console.warn("newBlockEntity is null" + currentPageEntity.originalName)
          else
            await insertTemplateAndRemoveBlock(newBlockEntity.uuid, journalTemplate, { pageName: currentPageEntity.originalName }) // 作成したブロックにテンプレートを挿入

        } else
          // ジャーナル属性でなく、ユーザー設定によりブロックを追加しない場合は何もしない
          console.log("no block page: " + currentPageEntity.originalName + " (not journal) (user setting is false)")

      } else {
        // 複数行の場合は何も処理しない

        // ページタグに最後に開いた時刻を記録するプロパティの挿入処理 (あしあと機能 footPrint)
        if (logseq.settings!.footPrint === true
          //ジャーナルかどうかDOMをチェック
          && (parent.document.querySelector("div.is-journals") as Node ? true
            : (parent.document.getElementById("journals") as Node ? true : false)) === false)
          await footPrint(blockTree) // 10秒後に遅延実行

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


export const defaultTemplate = async (blockUuid: BlockEntity["uuid"], pageName: string) => {
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
  await insertTemplateAndRemoveBlock(blockUuid, templateName, { pageName })
}


const loadByGraph = async () => {
  const currentGraphName = await getCurrentGraph()
  if (currentGraphName === "")
    return // demo graphの場合は実行しない
  else {
    const { preferredLanguage } = await logseq.App.getUserConfigs() as { preferredLanguage: string }
    logseq.useSettingsSchema(settingsTemplate(currentGraphName, preferredLanguage)) /* user settings */
    setTimeout(() => {
      if (!logseq.settings) logseq.showSettingsUI()
    }, 300)

    //移行メッセージ
    if (logseq.settings!.notice !== "2024071202") {
      logseq.UI.showMsg(`

        🆕 New features:

        1. 🖊️${t("Ability to insert creation date or time property into default template")}

        2. 👣${t("Footprint Feature")}
           > ${t("Insert 'lastOpenedAt' property to the page property")}
        
        
        Default Page Template plugin

        `, "warning", { timeout: 11000 })
      logseq.updateSettings({ notice: "2024071202" })
    }
  }
}

logseq.ready(main).catch(console.error)