import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { t } from 'logseq-l10n'


const datePropertyFormats = [
    "[[<% Today %>]]",
    "[[<% Today %>]] <% Time %>",
    "[[<% Today %>]] *<% Time %>*",
    "[[<% Today %>]] **<% Time %>**",
    "<% Today %>",
    "<% Today %> <% Time %>",
    "<% Today %> *<% Time %>*",
    "<% Today %> **<% Time %>**",
    "UTCDateTime",
    "localizeDefault",
    "journalDay",
    "[[<% yyyy %>]]",
    "[[<% yyyy %>]] journalDay",
    "[[<% yyyy/MM %>]]",
    "[[<% yyyy/MM %>]] journalDay",
]


// <% Today %> は、日付を表します。
// <% Time %> は、時間を表します。
// ブラケット [[ ]] は、リンクを表します。
// UTCDateTime は、2024-06-23T12:34:56Z のようなUTC日時を表します。
// localizeDefault は、ブラウザのロケールに基づいた日時を表します。
// journalDay は、20240623 のような生の日付を表します。
// [[<% yyyy %>]] は、年を表します。
// [[<% yyyy/MM %>]] は、年月を表します。
const propertyFormatDescriptions = () => `
        ${t("The '<% Today %>' represents the date. Based on user date format.")}
        ${t("The '<% Time %>' represents the time.")}
        ${t("The '[[ ]]' represents the link.")}
        ${t("The 'UTCDateTime' represents the UTC date and time like 2024-06-23T12:34:56Z.")}
        ${t("The 'localizeDefault' represents the date and time based on the browser's locale.")} (Use 'Intl.DateTimeFormat()')
        ${t("The 'journalDay' represents the raw date like 20240623.")}
        ${t("[[<% yyyy %>]] represents the year.")}
        ${t("[[<% yyyy/MM %>]] represents the year and month.")}
        `
/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (graphName: string, preferredLanguage: string): SettingSchemaDesc[] => [

    /* ---- Common Settings ---- */

    { // 共通設定
        key: "header0000",
        type: "heading",
        default: null,
        title: `0. 🖱️${t("Common Settings")}`,
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


    /* ---- Option 1. ---- */

    { //デフォルトテンプレート
        key: "header0010",
        type: "heading",
        default: null,
        title: `1. 🗒️${t("Default Template Feature")}`,
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


    /* ---- Option 1-a. ---- */

    { // 高度なデフォルトテンプレート
        key: "header0011",
        type: "heading",
        default: null,
        title: `1-a. 📓${t("Advanced Default Template Feature")}`,
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
    { // 最後尾にマッチする場合
        key: graphName + "/advancedEndWith",
        type: "string",
        default: "",
        title: t("End With"),
        inputAs: "textarea",
        // サブページなどにマッチさせる場合に使用します。
        description: `${t("Match if it ends with a specific string (e.g. sub page).")}`,
    },
    { // 正規表現にマッチする場合
        key: graphName + "/advancedRegex",
        type: "string",
        default: "",
        title: t("Regular Expression"),
        inputAs: "textarea",
        description: "",
    },


    /* ---- Option 2. ---- */

    { //Command Pallet: Insert Template
        key: "header0020",
        type: "heading",
        default: null,
        title: `2. ⌨️${t("Command Pallet Items: Insert Template Shortcut")} (${t("The First")},${t("The Second")},${t("The Third")})`,
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


    /* ---- Option 3. ---- */

    {// ジャーナルテンプレートの補完機能
        key: "header0030",
        type: "heading",
        default: null,
        title: `3. 📆${t("Completion of journal template")}`,
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
    },


    // /* ---- Option 4. ---- */

    { // 作成日時プロパティの挿入機能
        key: "header0040",
        type: "heading",
        default: null,
        // 4.  デフォルト・テンプレートに作成日または時間プロパティを挿入する機能
        title: `4. 🖊️${t("Ability to insert creation date or time property into default template")} 🆕`,
        // これは、マークダウンファイルに、作成日時をもつプロパティを自動挿入するためのオプション機能です。
        description: `
        ${t("This is an optional feature to automatically insert property with creation date or time in markdown files.")}`,
    },

    /* created */
    { // デフォルトテンプレートに対して、作成日時プロパティを挿入するかどうか
        key: "insertCreateDateToDefault",
        type: "boolean",
        default: false,
        // デフォルトテンプレートに作成日時プロパティを挿入する
        // このオプションは、デフォルトテンプレートに対して適用されます。
        // このオプションだけを使用するには、空のデフォルトテンプレートを設定してください。
        title: t("Enable"),
        // デフォルトテンプレートが呼び出された後に、そのページプロパティを挿入します。
        description: `
        ${t("Insert the page property after the default template is called.")}
        ${t("This option is applied to the default template.")}
        ${t("To use only this option, set an empty default template.")}
        `,
    },
    { // 作成日時プロパティの名称
        key: "createdAtPropertyName",
        type: "string",
        default: preferredLanguage === "ja" ? "作成日" : "created",
        title: t("created Property Name"),
        // 通常のCreated-Atプロパティは、Logseqコアにより隠されるため使用できません。
        // 代わりに、このプロパティを使用して、作成日時を記録します。
        // プロパティ名称を変更することができます。
        // プロパティ名に半角スペースは使用できません。
        // 不具合を避けるため、なるべく単語のみで記述します。
        description: `
        ${t("The 'Created-At' property is hidden by the Logseq core and cannot be used.")}
        ${t("Instead, use this property to record the creation date and time.")}
        ${t("The property name can be changed.")}
        ${t("Half-width spaces are not allowed in the property name.")}
        ${t("To avoid problems, describe it with single words as much as possible.")}`
    },
    { // プロパティの形式の選択
        key: "createdAtPropertyFormat",
        type: "enum",
        enumChoices: datePropertyFormats,
        default: "[[<% Today %>]] *<% Time %>*",
        title: t("created Property Format"),
        description: propertyFormatDescriptions()
    },
    /* End created */



    // /* ---- Option 5. ---- */

    { // あしあと機能
        key: "header0050",
        type: "heading",
        default: null,
        // 4. あしあと機能
        title: `5. 👣${t("Footprint Feature")} 🆕`,
        // これは、マークダウンファイルに、最後に開いた日時をもつプロパティを自動挿入するためのオプション機能です。
        // ジャーナル以外のページに適用されます。
        // 念のため、予備のグラフを作成して、使い勝手を確かめてください。
        description: `
        ${t("Insert 'lastOpenedAt' property to the page property")}

        ${t("This is an optional feature to automatically insert property with last opened date and time in markdown files.")}
        ${t("Applies to non-journal pages.")}
        
        ${t("For safety, create a spare graph and check the usability.")}`,
    },
    /* lastOpenedAt */
    { // 最後に開いた時刻を記録するプロパティの挿入機能
        key: "footPrint",
        type: "boolean",
        default: false,
        // ページプロパティに最後に開いた時刻を挿入する
        title: t("Enable"),
        // ボタンを使ってトグルできます！足跡を残したくないときに。
        // そでにこのプロパティが存在する場合は、30秒後に更新されます。
        description: `
        👣${t("It can be toggled via the toolbar button! For when you don't want to leave a footprint.")}
        ${t("If this property exists, it will be updated 30 seconds later.")}`,
    },
    { // 最後に開いた時刻プロパティの名称
        key: "lastOpenedAtPropertyName",
        type: "string",
        default: preferredLanguage === "ja" ? "最後に開いた日" : "last",
        title: t("lastOpenedAt Property Name"),
        // プロパティ名に半角スペースや「:」は使用できません。
        // 不具合を避けるため、なるべく単語のみで記述します。
        description: `
        ${t("Half-width spaces or ':' are not allowed in the property name.")}
        ${t("To avoid problems, describe it with single words as much as possible.")}`,
    },
    { // 最後に開いた時刻プロパティの形式の選択
        key: "lastOpenedAtPropertyFormat",
        type: "enum",
        enumChoices: datePropertyFormats,
        default: "[[<% Today %>]] *<% Time %>*",
        title: t("lastOpenedAt Property Format"),
        description: propertyFormatDescriptions()
    },
    { // 除外するページ一覧
        key: "lastOpenedAtExcludesPages",
        type: "string",
        default: "",
        // 除外ページのその名前
        title: t("List of pages to exclude"),
        inputAs: "textarea",
        // ページ名を入力
        // 複数指定する場合は、改行区切りで記述してください。
        // ページメニューから、除外リストに追加可能です。
        // プロパティの挿入直後に、そのプロパティを削除したい場合は、元に戻すショートカットキーである[Ctrl(Cmd)+Z]を押します。
        description: `
        ${t("Enter page names.")}
        ${t("Multiple specifications can be made by line breaks.")}
        ${t("It can be added to the exclusion list via the page menu.")}
        ${t("If you want to delete a property immediately after inserting it, press the undo shortcut key [Ctrl(Cmd)+Z].")}
        `
    },
    {// 除外するページ名の特徴 (先頭にマッチする場合)
        key: "lastOpenedAtExcludesPagesStartWith",
        type: "string",
        default: "",
        title: t("Start With"),
        inputAs: "textarea",
        description: `${t("Match if it starts with a specific string (e.g. hierarchy[AAA/]).")}`,
    },
    {// 特定の文字列を含む場合にマッチします。ほかの指定方法よりも強力ですので注意してください。
        key: "lastOpenedAtExcludesPagesContain",
        type: "string",
        default: "",
        title: t("Contain"),
        inputAs: "textarea",
        description: `
        ${t("Match if it contains a specific string.")}
        ⚠️${t("Be careful as it is more powerful than other specifications.")}`,
    },
    {// 正規表現にマッチする場合
        key: "lastOpenedAtExcludesPagesRegex",
        type: "string",
        default: "",
        title: t("Regular Expression"),
        inputAs: "textarea",
        description: "",
    },
    /* End lastOpenedAt */

]
