# Node.js & Pug Portfolio Site

Express.jsとPugテンプレートエンジンを使用したシンプルなポートフォリオサイトのサンプルプロジェクトです。

## 🌟 概要

このリポジトリには、Node.js、Express.js、Pugを使用して作成されたポートフォリオサイトのテンプレートが含まれています。レスポンシブデザインとモダンなUIを備えた、すぐに使えるポートフォリオサイトです。

このプロジェクトの`pug-app`ディレクトリは、[Express application generator](https://expressjs.com/en/starter/generator.html)を使用して作成されました。Express generatorは、Express.jsアプリケーションの基本構造を自動的に生成する公式ツールです。

## 📁 プロジェクト構造

```
Node_Pug/
└── pug-app/
    ├── app.js              # Expressアプリケーションのメインファイル
    ├── bin/
    │   └── www            # サーバー起動スクリプト
    ├── package.json       # プロジェクトの依存関係
    ├── package-lock.json  # 依存関係のロックファイル
    ├── public/            # 静的ファイル
    │   └── stylesheets/
    │       └── style.css  # カスタムCSSスタイル
    ├── routes/            # ルーティング定義
    │   └── index.js       # メインルート
    ├── views/             # Pugテンプレート
    │   ├── layout.pug     # 共通レイアウト
    │   ├── index.pug      # ホームページ
    │   ├── about.pug      # Aboutページ
    │   ├── projects.pug   # プロジェクトページ
    │   ├── contact.pug    # コンタクトページ
    │   └── error.pug      # エラーページ
    ├── .gitignore         # Git除外設定
    └── PORTFOLIO_TUTORIAL.md  # 詳細な作成手順

```

## ✨ 機能

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **モダンなUI**: グラデーションヒーローセクション、カード型レイアウト
- **4つのメインページ**:
  - ホーム: ヒーローセクションと特徴紹介
  - About: 自己紹介とスキル一覧
  - Projects: プロジェクトのグリッド表示
  - Contact: お問い合わせフォーム
- **固定ナビゲーションバー**: スムーズなページ間移動
- **カスタマイズ可能**: 簡単に内容やスタイルを変更可能

## 🛠️ Express Application Generatorについて

### Express Generatorとは
Express application generatorは、Express.jsプロジェクトの雛形を自動生成するコマンドラインツールです。プロジェクトの基本的なディレクトリ構造、設定ファイル、および必要な依存関係を含む`package.json`を作成します。

### Express Generatorのインストール方法
```bash
npm install -g express-generator
```

### Express Generatorの使い方

#### 基本的な使用方法
```bash
# デフォルト設定でアプリケーションを作成
express myapp

# Pugテンプレートエンジンを使用する場合（このプロジェクトで使用）
express --view=pug pug-app

# その他のオプション
express --help  # ヘルプを表示
```

#### 利用可能なオプション
- `--view <engine>`: ビューエンジンを指定（pug, ejs, hbs, hjs, jade, twig, vash）
- `--css <engine>`: CSSプリプロセッサを追加（less, stylus, compass, sass）
- `--git`: .gitignoreファイルを追加
- `--force`: 空でないディレクトリに強制的に作成

### このプロジェクトの作成方法
このプロジェクトの`pug-app`は以下のコマンドで作成されました：
```bash
express --view=pug pug-app
cd pug-app
npm install
```

その後、ポートフォリオサイト用にカスタマイズを行いました。

## 🚀 セットアップ方法

### 必要な環境
- Node.js (v14以上推奨)
- npm (Node.jsに含まれています)

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/kkawailab/Node_Pug.git
cd Node_Pug/pug-app
```

2. 依存関係をインストール
```bash
npm install
```

3. アプリケーションを起動
```bash
npm start
```

4. ブラウザでアクセス
```
http://localhost:3000
```

### 開発モードでの起動
開発中は、ファイルの変更を監視して自動的にサーバーを再起動するツールを使用することをお勧めします：
```bash
# nodemonをインストール（初回のみ）
npm install -g nodemon

# nodemonで起動
nodemon
```

## 🎨 カスタマイズ

### コンテンツの変更

各Pugファイルを編集して、自分の情報に更新できます：
- `views/index.pug`: ホームページのタイトルとメッセージ
- `views/about.pug`: 自己紹介とスキル
- `views/projects.pug`: プロジェクト情報
- `views/contact.pug`: 連絡先情報

### スタイルの変更

`public/stylesheets/style.css`を編集して、色やレイアウトをカスタマイズできます：
- 色の変更
- フォントの変更
- レイアウトの調整

## 📚 技術スタック

- **バックエンド**: Node.js, Express.js
- **テンプレートエンジン**: Pug (旧Jade)
- **スタイリング**: CSS3
- **パッケージ管理**: npm

## 📖 詳細なチュートリアル

このプロジェクトの作成手順について、より詳しい説明は[PORTFOLIO_TUTORIAL.md](pug-app/PORTFOLIO_TUTORIAL.md)をご覧ください。

## 🤝 貢献

プルリクエストや改善提案を歓迎します！

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

Created with ❤️ using Node.js and Pug