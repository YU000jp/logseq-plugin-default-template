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
export const settingsTemplate = (graphName: string, preferredLanguage: string, logseqVersionMd: boolean): SettingSchemaDesc[] => {
    const commonSettings: SettingSchemaDesc[] = [
        { key: "header0000", type: "heading", default: null, title: `0. 🖱️${t("Common Settings")}`, description: "" },
        {
            key: "insertTemplateIfPageEmpty", type: "boolean", default: false, title: t("Enable Default Template for existing pages"),
            description: `${t("When creating a new page, the cursor is placed on the first block, but not when opening an existing page.")}
            ${t("Enable this setting if you wish to apply the default template to existing pages as well.")}`
        }
    ]

    const defaultTemplateSettings: SettingSchemaDesc[] = [
        {
            key: "header0010", type: "heading", default: null, title: `1. 🗒️${t("Default Template Feature")}`,
            description: `${t("When open a page, insert the template if the first block is empty.")}
            ${t("This feature excludes journals.")}`
        },
        {
            key: graphName + "/defaultTemplateName", type: "string", default: "", title: t("Default") + " " + t("Template Name"),
            description: t("Empty means disabled.")
        }
    ]

    const advancedTemplateSettings: SettingSchemaDesc[] = [
        {
            key: "header0011", type: "heading", default: null, title: `1-a. 📓${t("Advanced Default Template Feature")}`,
            description: `${t("Insert a template based on the page title conditions.")}...`
        },
        {
            key: graphName + "/advancedStartWith", type: "string", default: "Test::TemplateName", title: t("Start With"),
            inputAs: "textarea", description: `${t("Match if it starts with a specific string (e.g. hierarchy[AAA/]).")}`
        },
        {
            key: graphName + "/advancedContain", type: "string", default: "", title: t("Contain"),
            inputAs: "textarea", description: `${t("Match if it contains a specific string.")}...`
        },
        {
            key: graphName + "/advancedEndWith", type: "string", default: "", title: t("End With"),
            inputAs: "textarea", description: `${t("Match if it ends with a specific string (e.g. sub page).")}`
        },
        {
            key: graphName + "/advancedRegex", type: "string", default: "", title: t("Regular Expression"),
            inputAs: "textarea", description: ""
        }
    ]

    const commandPaletteSettings: SettingSchemaDesc[] = [
        {
            key: "header0020", type: "heading", default: null,
            title: `2. ⌨️${t("Command Pallet Items: Insert Template Shortcut")} (${t("The First")},${t("The Second")},${t("The Third")})`,
            description: `${t("Register custom shortcut keys with KeyMaps of Settings. They are found in the Plugins tab.")}...`
        },
        { key: graphName + "/templateFirst", type: "string", default: "", title: t("The First") + " " + t("Template Name"), description: "" },
        { key: graphName + "/templateSecond", type: "string", default: "", title: t("The Second") + " " + t("Template Name"), description: "" },
        { key: graphName + "/templateThird", type: "string", default: "", title: t("The Third") + " " + t("Template Name"), description: "" }
    ]

    const journalSettings: SettingSchemaDesc[] = [
        {
            key: "header0030", type: "heading", default: null, title: `3. 📆${t("Completion of journal template")}`,
            description: `${t("Use this template if the journal template is not applied when journal single page is opened.")}...`
        },
        {
            key: graphName + "/journalTemplateName", type: "string", default: "",
            title: t("Journal") + " " + t("Template Name"), description: t("Empty means disabled.")
        }
    ]

    const createdAtSettings: SettingSchemaDesc[] = [
        {
            key: "header0040", type: "heading", default: null,
            title: `4. 🖊️${t("Ability to insert creation date or time property into default template")} 🆕`,
            description: `${t("This is an optional feature to automatically insert property with creation date or time in markdown files.")}`
        },
        {
            key: "insertCreateDateToDefault", type: "boolean", default: false, title: t("Enable"),
            description: `${t("Insert the page property after the default template is called.")}...`
        },
        {
            key: "createdAtPropertyName", type: "string",
            default: preferredLanguage === "ja" ? "作成日" : "created", title: t("created Property Name"),
            description: `${t("The 'Created-At' property is hidden by the Logseq core and cannot be used.")}...`
        },
        {
            key: "createdAtPropertyFormat", type: "enum", enumChoices: datePropertyFormats,
            default: "[[<% Today %>]] *<% Time %>*", title: t("created Property Format"),
            description: propertyFormatDescriptions()
        }
    ]

    const footprintSettings: SettingSchemaDesc[] = [
        {
            key: "header0050", type: "heading", default: null, title: `5. 👣${t("Footprint Feature")} 🆕`,
            description: `${t("Insert 'lastOpenedAt' property to the page property")}...`
        },
        {
            key: "footPrint", type: "boolean", default: false, title: t("Enable"),
            description: `👣${t("It can be toggled via the toolbar button! For when you don't want to leave a footprint.")}...`
        },
        {
            key: "lastOpenedAtPropertyName", type: "string",
            default: preferredLanguage === "ja" ? "最後に開いた日" : "last", title: t("lastOpenedAt Property Name"),
            description: `${t("Half-width spaces or ':' are not allowed in the property name.")}...`
        },
        {
            key: "lastOpenedAtPropertyFormat", type: "enum", enumChoices: datePropertyFormats,
            default: "[[<% Today %>]] *<% Time %>*", title: t("lastOpenedAt Property Format"),
            description: propertyFormatDescriptions()
        },
        {
            key: "lastOpenedAtExcludesPages", type: "string", default: "", title: t("List of pages to exclude"),
            inputAs: "textarea", description: `${t("Enter page names.")}...`
        },
        {
            key: "lastOpenedAtExcludesPagesStartWith", type: "string", default: "", title: t("Start With"),
            inputAs: "textarea", description: `${t("Match if it starts with a specific string (e.g. hierarchy[AAA/]).")}`
        },
        {
            key: "lastOpenedAtExcludesPagesContain", type: "string", default: "", title: t("Contain"),
            inputAs: "textarea", description: `${t("Match if it contains a specific string.")}...`
        },
        {
            key: "lastOpenedAtExcludesPagesRegex", type: "string", default: "", title: t("Regular Expression"),
            inputAs: "textarea", description: ""
        }
    ]

    return [
        ...commonSettings,
        ...defaultTemplateSettings,
        ...advancedTemplateSettings,
        ...commandPaletteSettings,
        ...journalSettings,
        ...(logseqVersionMd ? createdAtSettings : []),
        ...(logseqVersionMd ? footprintSettings : []),
    ]
}
