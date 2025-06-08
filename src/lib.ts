import { BlockEntity } from "@logseq/libs/dist/LSPlugin"
import { format } from "date-fns"
import { t } from "logseq-l10n"
import { booleanLogseqVersionMd } from "."


export const insertTemplateAndRemoveBlock = async (
  blockUuid: BlockEntity["uuid"],
  templateName: string,
  flag?: { journal?: boolean, pageName?: string }
) => {

  await logseq.App.insertTemplate(blockUuid, templateName)
  setTimeout(async () => {

    setTimeout(async () => {
      const block = await logseq.Editor.getBlock(blockUuid) as { content: BlockEntity["content"] } | null
      if (block === null
        || block.content !== "")
        return
      else
        await logseq.Editor.removeBlock(blockUuid) // テンプレート挿入後は空のブロックを削除
    }, 100)

    // ジャーナル以外
    if (flag?.journal !== true
      && flag?.pageName !== undefined) {
      // ユーザー設定から日付フォーマットを取得
      const { preferredDateFormat } = await logseq.App.getUserConfigs() as { preferredDateFormat: string }
      // ページタグにcreatedプロパティを挿入する処理
      if (logseq.settings!.insertCreateDateToDefault === true && booleanLogseqVersionMd() === true)
        setTimeout(async () => {
          const dateStr: string = formatDateString(logseq.settings!.createdAtPropertyFormat as string, new Date(), preferredDateFormat)
          console.log("dateStr", dateStr)
          if (dateStr !== "")
            await handlePageProperty(flag, logseq.settings!.createdAtPropertyName as string, dateStr, t("created property inserted."))
          else
            console.warn("Failed to get date string.")
        }, 1000)
    }

  }, 300)


  logseq.UI.showMsg(t("Template inserted."), "info", { timeout: 3000 })
}


// ページプロパティを挿入する処理
export const handlePageProperty = async (
  flag: { journal?: boolean; pageName?: string },
  propertyName: string,
  dateStr: string,
  msg: string
): Promise<string> => {

  const blocks = await logseq.Editor.getPageBlocksTree(flag.pageName as string) as { uuid: BlockEntity["uuid"]; content: BlockEntity["content"] }[] | null
  if (blocks) {
    if (blocks[0].content.includes(":: "))
      await logseq.Editor.updateBlock(blocks[0].uuid, `${propertyName}:: ${dateStr}\n` + blocks[0].content)
    else {
      //ページプロパティを含まない場合は、前にブロックを挿入する
      await logseq.Editor.insertBlock(blocks[0].uuid, `${propertyName}:: ${dateStr}\n`, { before: true, sibling: true, isPageBlock: true })
    }
    logseq.UI.showMsg(msg, "info", { timeout: 3000 })
  }
  else
    console.warn("Failed to get blocks.")
  return ""
}

// 日付フォーマットの処理
export const formatDateString = (
  configStr: string,
  today: Date,
  preferredDateFormat: string
): string => {
  // <% Today %> は、日付を表します。
  // <% Time %> は、時間を表します。
  // UTCDateTime は、2024-06-23T12:34:56Z のようなUTC日時を表します。
  // localizeDefault は、ブラウザのロケールに基づいた日時を表します。
  // journalDay は、20240623 のような生の日付を表します。
  switch (configStr as
  "[[<% Today %>]]" |
  "[[<% Today %>]] <% Time %>" |
  "[[<% Today %>]] *<% Time %>*" |
  "[[<% Today %>]] **<% Time %>**" |
  "<% Today %>" |
  "<% Today %> <% Time %>" |
  "<% Today %> *<% Time %>*" |
  "<% Today %> **<% Time %>**" |
  "UTCDateTime" |
  "localizeDefault" |
  "journalDay" |
  "[[<% yyyy %>]]" |
  "[[<% yyyy %>]] journalDay" |
  "[[<% yyyy/MM %>]]" |
  "[[<% yyyy/MM %>]] journalDay"
  ) {
    case "[[<% Today %>]]":
      return `[[${format(today, preferredDateFormat)}]]`
      break
    case "[[<% Today %>]] <% Time %>":
      return `[[${format(today, preferredDateFormat)}]] ${format(today, "HH:mm")}`
      break
    case "[[<% Today %>]] *<% Time %>*":
      return `[[${format(today, preferredDateFormat)}]] *${format(today, "HH:mm")}*`
      break
    case "[[<% Today %>]] **<% Time %>**":
      return `[[${format(today, preferredDateFormat)}]] **${format(today, "HH:mm")}**`
      break
    case "<% Today %>":
      return format(today, preferredDateFormat)
      break
    case "<% Today %> <% Time %>":
      return format(today, preferredDateFormat) + " " + format(today, "HH:mm")
      break
    case "<% Today %> *<% Time %>*":
      return format(today, preferredDateFormat) + " *" + format(today, "HH:mm") + "*"
      break
    case "<% Today %> **<% Time %>**":
      return format(today, preferredDateFormat) + " **" + format(today, "HH:mm") + "**"
      break
    case "UTCDateTime":
      return format(today, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      break
    case "localizeDefault":
      return format(today, "yyyy-MM-dd'T'HH:mm:ss")
      break
    case "journalDay":
      return format(today, "yyyyMMdd")
      break
    case "[[<% yyyy %>]]":
      return `[[${format(today, "yyyy")}]]`
      break
    case "[[<% yyyy %>]] journalDay":
      return `[[${format(today, "yyyy")}]] ${format(today, "yyyyMMdd")}`
      break
    case "[[<% yyyy/MM %>]]":
      return `[[${format(today, "yyyy/MM")}]]`
      break
    case "[[<% yyyy/MM %>]] journalDay":
      return `[[${format(today, "yyyy/MM")}]] ${format(today, "yyyyMMdd")}`
      break
    default:
      return ""
      break
  }
}