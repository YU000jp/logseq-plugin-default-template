import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { t } from 'logseq-l10n'

/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (graphName: string): SettingSchemaDesc[] => [
/* */
    { // 共通設定
        key: "header0000",
        type: "heading",
        default: null,
        title: `0. ${t("Common Settings")}`,
        description: "",
    },
    { // 既存のページを開いたときに、ブロックが0の場合に、テンプレートを挿入するかどうか
        key: "insertTemplateIfPageEmpty",
        type: "boolean",
        default: false,
        // 既存ページのデフォルトテンプレートを有効にする
        title: t("Enable Default Template for existing pages"),
        // 新規作成の場合は、ひとつ目のブロックにカーソルが置かれるが、既存のページを開いたときは、そうではない。
        // 既存のページに対しても、デフォルトテンプレートを適用したい場合は、この設定を有効にする。
        description: `
        ${t("When creating a new page, the cursor is placed on the first block, but not when opening an existing page.")}
        ${t("Enable this setting if you wish to apply the default template to existing pages as well.")}
        `,
    },
/* */
    { //デフォルトテンプレート
        key: "header0010",
        type: "heading",
        default: null,
        title: `1. ${t("Default Template Feature")}`,
        // ページを開いたときに、一行目のブロックが空の場合に、テンプレートを挿入する。
        // この機能は、ジャーナルを除外します。
        description: `
        ${t("When open a page, insert the template if the first block is empty.")}
        ${t("This feature excludes journals.")}`,

    },
    { //デフォルトテンプレート名
        key: graphName + "/defaultTemplateName",
        type: "string",
        default: "",
        title: t("Default") + " " + t("Template Name"),
        //空欄であれば、無効になります。
        description: t("Empty means disabled."),
    },
    { // 高度なデフォルトテンプレート
        key: "header0011",
        type: "heading",
        default: null,
        title: `1-a. ${t("Advanced Default Template Feature")}`,
        // 特定の条件で、テンプレートを挿入する。
        // 複数にマッチした場合は、最初にマッチしたものが適用されます。
        // 空欄であれば、無効になります。
        // 複数指定する場合は、改行区切りで記述してください。
        // 「AAA::templateName」のように「::」で区切って、条件の文字列とテンプレート名を記述します。
        // ページタイトルに絵文字を使用している場合もマッチします。
        //${ t("If this is enabled, the above item will be disabled.") } FIX:上の項目も有効にした。
        description: `
        ${t("Insert a template based on the page title conditions.")}

        ${t("Multiple specifications can be made by line breaks.")}
        ${t("If multiple conditions are met, the first one will be applied.")}
        ${t("Write the condition string and template name separated by '::'.")}
        ${t("Example: `AAA::templateName`")}
        ${t("It also matches if use Emoji[🌞] in the page title.")}
        ${t("Empty means disabled.")}`,
    },
    { // 先頭にマッチする場合
        key: graphName + "/advancedStartWith",
        type: "string",
        default: "Test::TemplateName",
        title: t("Start With"),
        inputAs: "textarea",
        // 階層などにマッチさせる場合に使用します。
        description: `${t("Match if it starts with a specific string (e.g. hierarchy[AAA/]).")}`,

    },
    { // 文字列にマッチする場合
        key: graphName + "/advancedContain",
        type: "string",
        default: "",
        title: t("Contain"),
        inputAs: "textarea",
        // 特定の文字列を含む場合にマッチします。ほかの指定方法よりも強力ですので注意してください。
        description: `
        ${t("Match if it contains a specific string.")}
        ⚠️${t("Be careful as it is more powerful than other specifications.")}`,
    },
    { //最後尾にマッチする場合
        key: graphName + "/advancedEndWith",
        type: "string",
        default: "",
        title: t("End With"),
        inputAs: "textarea",
        // サブページなどにマッチさせる場合に使用します。
        description: `${t("Match if it ends with a specific string (e.g. sub page).")}`,
    },

    { //Command Pallet: Insert Template
        key: "header0020",
        type: "heading",
        default: null,
        title: `2. ${t("Command Pallet Items: Insert Template Shortcut")} (${t("The First")},${t("The Second")},${t("The Third")})`,
        // キーマップでカスタムショートカットを登録。ブロック編集中にショートカットを押すとテンプレートが挿入される。
        // Command Pallet からも呼び出せます。
        description: `
        ${t("Register custom shortcut keys with KeyMaps of Settings. They are found in the Plugins tab.")}
        ${t("Call from the Command Pallet or press the shortcut key while editing the block to insert the template.")}
        ${t("Empty means disabled.")}`,
    },
    { //templateFirst
        key: graphName + "/templateFirst",
        type: "string",
        default: "",
        title: t("The First") + " " + t("Template Name"),
        description: "",
    },
    { //templateSecond
        key: graphName + "/templateSecond",
        type: "string",
        default: "",
        title: t("The Second") + " " + t("Template Name"),
        description: "",
    },
    { //templateThird
        key: graphName + "/templateThird",
        type: "string",
        default: "",
        title: t("The Third") + " " + t("Template Name"),
        description: "",
    },
    {
        key: "header0030",
        type: "heading",
        default: null,
        // ジャーナルテンプレートの補完機能
        title: `3. ${t("Completion of journal template")}`,
        // ジャーナルのシングルページを開いたときに、ジャーナルテンプレートが適用されない場合に、このテンプレートを使用します。
        // 注: ジャーナルテンプレートが設定されていない場合にも適用します。
        // 現在のジャーナル・テンプレートと同じに設定することをお勧めします。
        description: `
        ${t("Use this template if the journal template is not applied when journal single page is opened.")}
        ${t("Note: Also applies when the journal template is not set.")}
        ${t("It is recommended to set the same as current journal template.")}
        `,
    },
    {//ジャーナル用テンプレート名
        key: graphName + "/journalTemplateName",
        type: "string",
        default: "",
        title: t("Journal") + " " + t("Template Name"),
        description: t("Empty means disabled."),
    }
]
