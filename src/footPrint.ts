import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin"
import { t } from "logseq-l10n"
import { formatDateString, handlePageProperty } from "./lib"

export const footPrint = async (blockTree: { uuid: BlockEntity["uuid"]; content: BlockEntity["content"]; properties: BlockEntity["properties"] }[]) => {

  // プロパティが存在する場合は削除する
  if (blockTree[0].properties) {
    console.log("footPrint > search for existing property and remove it. (if exists) ... Wait for 30 seconds.")
    // 追加待機 30秒後 (ページを開いたあとに、すぐに上書きしないようにする)
    await new Promise(resolve => setTimeout(resolve, 30000))
    console.log("footPrint > end of waiting.")

    //FIX: Logseqのプロパティ名に関するバグ対策
    const propertyName = (logseq.settings!.lastOpenedAtPropertyName as string).replace(/([A-Z])/g, "-$1").toLowerCase()
    const propertyName2 = (logseq.settings!.lastOpenedAtPropertyName as string).replace(/([A-Z])/g, "_$1").toLowerCase()
    const propertyName3 = (logseq.settings!.lastOpenedAtPropertyName as string).toLowerCase()
    const propertyName4 = logseq.settings!.lastOpenedAtPropertyName as string
    // await logseq.Editor.removeBlockProperty(blockTree[0].uuid, propertyName) //FIX: ページプロパティは削除されない
    // 複数行をもつblockTree[0].contentから、先頭が「${propertyName}:: 」もしくは「${propertyName2}::」で始まる行をすべて削除する
    const content = blockTree[0].content.split("\n").filter((v: string) =>
      !v.startsWith(`${propertyName}::`)
      && !v.startsWith(`${propertyName2}::`)
      && !v.startsWith(`${propertyName3}::`)
      && !v.startsWith(`${propertyName4}::`)
    ).join("\n")
    if (content !== blockTree[0].content) {
      await logseq.Editor.updateBlock(blockTree[0].uuid, content)
      console.log("lastOpenedAt property removed.")
      // 追加待機 300ms後 (プロパティを削除したあとに、すぐに挿入しないようにする)
      await new Promise(resolve => setTimeout(resolve, 300))
      console.log("footPrint > Insert lastOpenedAt property ...")
    }
  }

  // ユーザー設定から日付フォーマットを取得
  const { preferredDateFormat } = await logseq.App.getUserConfigs() as { preferredDateFormat: string }
  setTimeout(async () => {
    const dateStr: string = formatDateString(logseq.settings!.lastOpenedAtPropertyFormat as string, new Date(), preferredDateFormat)
    console.log("dateStr", dateStr)
    if (dateStr !== "") {
      const currentPageEntity = await logseq.Editor.getCurrentPage() as { originalName: PageEntity["originalName"] } | null
      if (currentPageEntity) {
        // ページの除外
        if (
          // logseq.settings!.lastOpenedAtExcludesPagesに複数行でページ名を記入すると、そのページは除外される
          (logseq.settings!.lastOpenedAtExcludesPages as string !== ""
            && logseq.settings!.lastOpenedAtExcludesPages as string !== currentPageEntity.originalName
            && (logseq.settings!.lastOpenedAtExcludesPages as string).split("\n").includes(currentPageEntity.originalName))
          // logseq.settings!.lastOpenedAtExcludesPagesStartWithに複数行で、ページ名の先頭部分を記入すると、そのページは除外される
          || (logseq.settings!.lastOpenedAtExcludesPagesStartWith as string !== ""
            && logseq.settings!.lastOpenedAtExcludesPagesStartWith as string !== currentPageEntity.originalName
            && (logseq.settings!.lastOpenedAtExcludesPagesStartWith as string).split("\n").some((v: string) => currentPageEntity.originalName.startsWith(v)))
          // logseq.settings!.lastOpenedAtExcludesPagesContainに複数行で、ページ名の一部を記入すると、そのページは除外される
          || (logseq.settings!.lastOpenedAtExcludesPagesContain as string !== ""
            && logseq.settings!.lastOpenedAtExcludesPagesContain as string !== currentPageEntity.originalName
            && (logseq.settings!.lastOpenedAtExcludesPagesContain as string).split("\n").some((v: string) => currentPageEntity.originalName.includes(v)))
          // logseq.settings!.lastOpenedAtExcludesPagesRegexに複数行で、正規表現を記入すると、そのページは除外される
          || (logseq.settings!.lastOpenedAtExcludesPagesRegex as string !== ""
            && logseq.settings!.lastOpenedAtExcludesPagesRegex as string !== currentPageEntity.originalName
            && (logseq.settings!.lastOpenedAtExcludesPagesRegex as string).split("\n").some((v: string) => new RegExp(v).test(currentPageEntity.originalName)))
        ) {
          console.log("This page is excluded.")
          return
        }
        // ページプロパティに挿入する処理を実行
        await handlePageProperty({ pageName: currentPageEntity.originalName }, logseq.settings!.lastOpenedAtPropertyName as string, dateStr, t("lastOpenedAt property inserted.") + `\n\n[[${currentPageEntity.originalName}]]`)
      } else
        console.warn("currentPageEntity is null.")
    } else
      console.warn("Failed to get date string.")
  }, 5000)
}
