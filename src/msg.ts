export const msgInfo = (message: string, additionalMessage: string) => {
  console.info(message + "\n" + additionalMessage)
  logseq.UI.showMsg(message, "info", { timeout: 3000 })
}
export const msgWarn = (message: string, additionalMessage: string) => {
  console.warn(message + "\n" + additionalMessage)
  logseq.UI.showMsg(message, "warn", { timeout: 3000 })
}
