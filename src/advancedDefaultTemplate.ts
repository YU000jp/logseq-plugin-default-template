import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"
import { currentGraphName, defaultTemplate } from "."
import { insertTemplateAndRemoveBlock } from './lib'
import { msgInfo, msgWarn } from "./msg"

export const advancedDefaultTemplate = async (blockUuid: BlockEntity["uuid"], pageName: PageEntity["originalName"]) => {
  const startWith = logseq.settings![currentGraphName + "/advancedStartWith"] as string
  const contain = logseq.settings![currentGraphName + "/advancedContain"] as string
  const endWith = logseq.settings![currentGraphName + "/advancedEndWith"] as string
  const regex = logseq.settings![currentGraphName + "/advancedRegex"] as string

  const startWithArray = (startWith.includes("\n")) ? startWith.split("\n") : [startWith]
  const containArray = (contain.includes("\n")) ? contain.split("\n") : [contain]
  const endWithArray = (endWith.includes("\n")) ? endWith.split("\n") : [endWith]
  const regexArray = (regex.includes("\n")) ? regex.split("\n") : [regex]

  let isMatch = false
  let matchedTemplate = ""

  // console.log("pageName", pageName)
  // console.log("startWithArray", startWithArray)
  // console.log("containArray", containArray)
  // console.log("endWithArray", endWithArray)
  // console.log("regexArray", regexArray)

  // 先頭にマッチする場合
  if (startWithArray.length > 0
    && startWithArray[0] !== "")
    for (const sw of startWithArray) {
      if (sw.includes("::")) {
        if (pageName.startsWith(sw.split("::")[0])) {
          isMatch = true
          //swには「AAA::TemplateName」の形式で設定されている
          matchedTemplate = sw.split("::")[1]
          console.log("matchedTemplate", matchedTemplate)
          break
        }
      } else
        msgWarnInvalidFormat(sw)
    }

  // 文字列にマッチする場合
  if (!isMatch
    && containArray.length > 0
    && containArray[0] !== "")
    for (const c of containArray)
      if (c.includes("::")) {
        if (pageName.includes(c.split("::")[0])) {
          isMatch = true
          //cには「AAA::TemplateName」の形式で設定されている
          matchedTemplate = c.split("::")[1]
          console.log("matchedTemplate", matchedTemplate)
          break
        }
      } else
        msgWarnInvalidFormat(c)

  // 最後尾にマッチする場合
  if (!isMatch
    && endWithArray.length > 0
    && endWithArray[0] !== "")
    for (const ew of endWithArray)
      if (ew.includes("::")) {
        if (pageName.endsWith(ew.split("::")[0])) {
          isMatch = true
          //ewには「AAA::TemplateName」の形式で設定されている
          matchedTemplate = ew.split("::")[1]
          console.log("matchedTemplate", matchedTemplate)
          break
        }
      } else
        msgWarnInvalidFormat(ew)

  // 正規表現にマッチする場合
  if (!isMatch
    && regexArray.length > 0
    && regexArray[0] !== "")
    for (const r of regexArray)
      if (r.includes("::")) {
        const regex = new RegExp(r.split("::")[0])
        if (regex.test(pageName)) {
          isMatch = true
          //rには「AAA::TemplateName」の形式で設定されている
          matchedTemplate = r.split("::")[1]
          console.log("matchedTemplate", matchedTemplate)
          break
        }
      } else
        msgWarnInvalidFormat(r)


  if (isMatch) {
    if (await logseq.App.existTemplate(matchedTemplate) === true)
      await insertTemplateAndRemoveBlock(blockUuid, matchedTemplate, { pageName }) // テンプレート挿入を実行
    else
      msgForThisFeature(`
      ${t("Template not found.")}
      "${matchedTemplate}"
      `, "warn")
  } else {
    console.log("No match found. (Advanced Default Template Feature)") // マッチするものがなかった場合はログだけ出力
    await defaultTemplate(blockUuid, pageName) // デフォルトテンプレートを挿入する
  }
}

const msgWarnInvalidFormat = (sw: string) => {
  const message = `
  ${t("Invalid format. Please check the settings.")}
  "${sw}"
  `
  msgForThisFeature(message, "warn")
}


const msgForThisFeature = (message: string, status: string) => {
  const additionalMessage = `
  (Advanced Default Template Feature)
  `
  if (status === "warn")
    msgWarn(message, additionalMessage)
  else
    msgInfo(message, additionalMessage)
}