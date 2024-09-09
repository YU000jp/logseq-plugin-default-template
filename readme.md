# Logseq Plugin: Default Page Template / Footprint

1. Automatically apply a page template
   > Logseq itself does not have the ability to automatically apply templates to new pages. (only journal templates). This plugin makes it possible. [From Logseq Discuss](https://discuss.logseq.com/t/extend-default-template-functionality/14452)
1. Footprint Feature
   - Property the date and time the page was last opened

> [!WARNING]
This plugin does not work with Logseq db version now.

<div align="right">

[English](https://github.com/YU000jp/logseq-plugin-default-template) | [日本語](https://github.com/YU000jp/logseq-plugin-default-template/blob/main/readme.ja.md) [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-default-template)](https://github.com/YU000jp/logseq-plugin-default-template/releases)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-default-template/total.svg)](https://github.com/YU000jp/logseq-plugin-default-template/releases) Published 20240622 
<a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

---

## Feature Options

1. **Default Page Template** Feature
   > Main function. Try this at the beginning.
   - Apply template if only the first block is present when the page is opened and it is empty
1. (1-a) **Advanced Default Page Template** Feature
   - Insert a template based on the page title conditions.
     > With a page with a specific hierarchy or with a specific string
1. Command Pallet Items: "Insert Template" **Shortcut**
   > The 3 commands can be used.
   - Quickly insert a template by executing a shortcut while editing a block.
1. Completion of journal template
   > Use this template if the journal template is not applied when journal single page is opened.
1. 🖊️ Ability to insert creation date/time properties into the default template
   - Optional functionality to automatically insert a property containing a creation date or time in a markdown file (page).
1. 👣 **Footprint** Feature
   - Optional feature to automatically insert a property in the markdown file (page) with the date and time of the last opening.

## Demo

![Default Template プラグイン](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/26771e35-5cc3-4d3a-9299-5f1d733c7782)

---

## Getting Started

### Install from Logseq Marketplace

- Press [`---`] on the top right toolbar to open [`Plugins`]. Select marketplace. Type `Default` in the search field, select it from the search results and install

  > ![プラグイン](https://github.com/user-attachments/assets/060145fd-f680-425d-aa66-6e682cc0a7f3)

### Usage

- Configure various settings in the plugin settings.

#### How to make an initial check

1. *Create a template block* for the default somewhere on the page in the usual Logseq way.

   > ![how to](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/45b90eee-db06-4f4b-87f7-895341960f71)
1. Create a sub block in the block and put the test message there.

   > ![how to](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/7a960c3b-05ee-402c-90e0-9f15c3cd8cfb)
1. In the plugin settings, enter a template name.
   > Note: Enter the template name correctly.
   
   > ![image](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/dbc697c7-f205-4073-88ca-f875ee950d1e)
1. Open a new page.
1. If it is applied, it is successful.

---

## Showcase / Questions / Ideas / Help

- Note: The plugin settings are provided for each graph.
- Note: The default template does not apply to journals (attributes). Use the journal template.
  1. [More journal templates plugin](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)
- Go to the [Discussions](https://github.com/YU000jp/logseq-plugin-default-template/discussions) tab to ask and find this kind of things.
- This plugin may no longer work or may become unnecessary due to future updates to the Logseq core.
- Integration with existing
  1. [Full House Templates plugin](https://github.com/stdword/logseq13-full-house-plugin)
  1. [powerblocks plugin](https://github.com/hkgnp/logseq-powerblocks-plugin)
  1. [SmartBlocks plugin](https://github.com/sawhney17/logseq-smartblocks)
  1. [Side Block plugin](https://github.com/YU000jp/logseq-plugin-side-block)
  1. [Dynamic variables](https://mschmidtkorth.github.io/logseq-msk-docs/#/page/dynamic%20variables) of Logseq standard
  > Template gallery: [Template Gallery plugin](https://github.com/dangermccann/logseq-template-gallery)
- Document link
  1. [templates (Logseq documents)](https://docs.logseq.com/#/page/templates)

## Credit

- Author > [@YU000jp](https://github.com/YU000jp)
