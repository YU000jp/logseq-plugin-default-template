import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"



export const insertTemplateAndRemoveBlock = async (blockUuid: BlockEntity["uuid"], templateName: string) => {

  await logseq.App.insertTemplate(blockUuid, templateName)
  setTimeout(async () => {
    const block = await logseq.Editor.getBlock(blockUuid) as { content: BlockEntity["content"]}  | null
    if (block === null
      || block.content !== "")
      return

    else
      await logseq.Editor.removeBlock(blockUuid) // テンプレート挿入後は空のブロックを削除
  }, 300)
  logseq.UI.showMsg(t("Template inserted."), "info", { timeout: 3000 })
}
