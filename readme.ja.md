# Logseq プラグイン: Default Template (for New Page)

- ページテンプレートを自動的に適用します。

<div align="right">

[English](https://github.com/YU000jp/logseq-plugin-default-template) | [日本語](https://github.com/YU000jp/logseq-plugin-default-template/blob/main/readme.ja.md) [![latest release version](https://img.shields.io/github/v/release/YU000jp/logseq-plugin-default-template)](https://github.com/YU000jp/logseq-plugin-default-template/releases)
[![Downloads](https://img.shields.io/github/downloads/YU000jp/logseq-plugin-default-template/total.svg)](https://github.com/YU000jp/logseq-plugin-default-template/releases) Published 20240622
<a href="https://www.buymeacoffee.com/yu000japan"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=🍕&slug=yu000japan&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" /></a>
</div>

---

## 機能オプション

1. **デフォルトテンプレート**機能
   > メイン機能。最初に、これを試してみてください。
   - ページを開いたときに最初のブロックだけが存在し、それが空である場合にテンプレートを適用します
1. (1-a) **高度なデフォルトテンプレート**機能
   - ページタイトルの条件に基づいてテンプレートを挿入します
     > 特定の親を持つページや、特定の文字列を持つページなど
1. コマンドパレットの項目 「テンプレートの挿入」**ショートカット**
   > 3つまでカスタムコマンドが使えます。
   - ブロック編集中にショートカットを実行することで、素早くテンプレートを挿入できます。
1. ジャーナルテンプレートの補完機能
   > ジャーナルのシングルページを開いたときに、ジャーナルテンプレートが適用されない場合に、このテンプレートを使用します。

## 動作デモ

![Default Template プラグイン日本語](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/31f17b79-3b20-440a-b69f-133748476c73)

---

## はじめに

### Logseqマーケットプレースからインストール

- 右上のツールバーの[`---`]を押して[`プラグイン`]を開き、マーケットプレイスを選択します。検索フィールドに `Default` と入力し、検索結果から選択してインストールします。

  > ![スクリーンショット 2024-06-22 162128](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/54b4ad6a-ef65-4ef6-b6ba-cd628be241ea)

### 使い方

#### 初回チェックの方法

1. 通常のLogseqの方法で、どこかのページに、デフォルト用の*テンプレートブロックを作成*します。

   > ![how to](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/6b84f498-1573-4f7e-9812-be7fa818981f)
1. そのブロックの中にサブブロックを作り、そこにテストメッセージを置きます。

   > ![image](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/6a84a83b-a62e-49bd-8303-ac1599228c54)
1. プラグインの設定で、テンプレート名を入力します。
   > 注：テンプレート名は正確に入力してください。

   > ![image](https://github.com/YU000jp/logseq-plugin-default-template/assets/111847207/e39d4775-b6e3-497c-9f19-3beb378cc648)
1. 新しいページを開きます。
1. 適用されれば成功です。

---

## ショーケース / 質問 / アイデア / ヘルプ

- プラグイン設定は、グラフごとに用意されています。
- 注: デフォルトテンプレートは、ジャーナル(属性)には適用されません。ジャーナルテンプレートを使ってください。
  1. [More journal templates プラグイン](https://github.com/YU000jp/logseq-plugin-weekdays-and-weekends)
- [Discussions](https://github.com/YU000jp/logseq-plugin-default-template/discussions)にて、この種の書き込みがないか確認してください。無ければ、新たに書き込みをしてください。
- このプラグインは、将来のLogseqコアのアップデートにより機能しなくなったり、不要になる可能性があります。
- 既存の各プラグイン [Full House Templates](https://github.com/stdword/logseq13-full-house-plugin)、[powerblocks](https://github.com/hkgnp/logseq-powerblocks-plugin)、[SmartBlocks](https://github.com/sawhney17/logseq-smartblocks)、[Side Block](https://github.com/YU000jp/logseq-plugin-side-block) との統合が可能です。Logseqの動的変数も動作します。

## クレジット

- アイコン > [icooon-mono.com](https://icooon-mono.com/11304-%e3%82%a2%e3%83%b3%e3%82%b1%e3%83%bc%e3%83%88%e7%94%a8%e7%b4%99%e3%81%ae%e3%82%a2%e3%82%a4%e3%82%b3%e3%83%b3%e7%b4%a0%e6%9d%90/)
- 製作者 > [@YU000jp](https://github.com/YU000jp)
