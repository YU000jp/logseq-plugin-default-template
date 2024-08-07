import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"
import { getCurrentGraph } from "."
import { insertTemplateAndRemoveBlock } from './lib'
import { msgWarn } from "./msg"

const msgId = "SlashCommand (logseq-plugin-default-template)"

// 処理中フラグ (連続でコマンドを実行しないため)
let processing = false

export const addCommandPaletteCommands = () => {

  logseq.App.registerCommandPalette({
    key: "insertTemplateFirst",
    label: t("Insert Template") + " " + t("The First"),
    keybinding: { binding: [] },
  }, async () =>
    command("First"))

  logseq.App.registerCommandPalette({
    key: "insertTemplateSecond",
    label: t("Insert Template") + " " + t("The Second"),
    keybinding: { binding: [] },
  }, async () =>
    command("Second"))

  logseq.App.registerCommandPalette({
    key: "insertTemplateThird",
    label: t("Insert Template") + " " + t("The Third"),
    keybinding: { binding: [] },
  }, async () =>
    command("Third"))
}


const command = async (commandNumber: string) => {
  if (processing) return
  setTimeout(() => { processing = false }, 2000)
  processing = true

  const templateName = logseq.settings![(await getCurrentGraph()) + "/template" + commandNumber] as string
  if (templateName === "") {
    msgWarn(t("Template is not set."), msgId) // テンプレートが設定されていない場合は警告を表示
    return
  }
  //コマンドが実行されたことをログに出力
  console.log(`Command: Insert Template ${commandNumber}`, templateName)

  await logseq.Editor.restoreEditingCursor() // 編集中のブロックを取得

  const currentEditingBlock = await logseq.Editor.getCurrentBlock() as { uuid: BlockEntity["uuid"] } | null
  if (currentEditingBlock === null) {
    msgWarn(t("Block is not selected."), msgId) // 選択されているブロックがない場合は警告を表示
    return
  }

  if (await logseq.App.existTemplate(templateName) === false)
    msgWarn(t("Template not found."), msgId) // テンプレートが見つからない場合は警告を表示
  else
    insertTemplateAndRemoveBlock(currentEditingBlock.uuid, templateName)// テンプレートを挿入
}
