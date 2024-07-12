import { t } from "logseq-l10n"

// For Last Opened At Property
export const keyLastOpenedAt = "defaultTemplateLastOpenedAt"
export const flagKeyLastOpenedAt = "defaultTemplateLastOpenedAtOff"
export const toggleLastOpenTimeInsertion = (config: boolean, flag?: { msgOff?: true }) => {
  if (config === false) {
    parent.document.body.classList.add(flagKeyLastOpenedAt) // オフの時に、クラスを追加
    if (flag?.msgOff) return
    logseq.UI.showMsg(t("lastOpenedAt property will not be inserted."), "info", { timeout: 3000 })
  } else {
    parent.document.body.classList.remove(flagKeyLastOpenedAt) // クラスを削除
    if (flag?.msgOff) return
    logseq.UI.showMsg(t("lastOpenedAt property will be inserted."), "info", { timeout: 3000 })
  }
}

export const toolbarButtonForLastOpenedAt = () => logseq.App.registerUIItem('toolbar', {
  key: keyLastOpenedAt,
  template: `
<div>
  <a class="button icon" data-on-click="${keyLastOpenedAt}" id="${keyLastOpenedAt}" style="font-size: 16px" title="${t("This toggle is for 'lastOpenedAt' property of Footprint feature.")}\nDefault Template plugin">
    <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
    <g>
      <path class="st0" d="M75.071,37.994c-85.775,27.432-91.109,189.36-50.785,282.24l136.988-10.244c0,0,18.469-81.1,17.828-160.524
        C178.753,106.136,154.083,12.727,75.071,37.994z" style="fill: rgb(199, 167, 199);"></path>
      <path class="st0" d="M29.257,356.393c0,0-4.604,131.482,87.014,121.318c81.18-9.006,49.805-135.703,49.805-135.703L29.257,356.393z
        " style="fill: rgb(199, 167, 199);"></path>
      <path class="st0" d="M436.927,37.994c-79.01-25.268-103.68,68.142-104.03,111.472c-0.642,79.425,17.828,160.524,17.828,160.524
        l136.986,10.244C528.038,227.354,522.704,65.426,436.927,37.994z" style="fill: rgb(199, 167, 199);"></path>
      <path class="st0" d="M345.925,342.008c0,0-31.375,126.697,49.803,135.703c91.619,10.164,87.016-121.318,87.016-121.318
        L345.925,342.008z" style="fill: rgb(199, 167, 199);"></path>
    </g>
    </svg>
  </a>
</div>
    `,
})
