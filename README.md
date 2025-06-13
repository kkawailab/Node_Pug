# Node.js & Pug Webアプリケーション

Express.jsとPugテンプレートエンジンを使用したWebアプリケーションのサンプルプロジェクト集です。

## 🌟 概要

このリポジトリには、Node.js、Express.js、Pugを使用して作成された2つのWebアプリケーションサンプルが含まれています：

1. **ポートフォリオサイト (pug-app)** - レスポンシブデザインとモダンなUIを備えた、すぐに使えるポートフォリオサイト
2. **投票アプリケーション (vote-app)** - SQLiteを使用したデータ永続化機能を持つオンライン投票システム

両プロジェクトとも[Express application generator](https://expressjs.com/en/starter/generator.html)を使用して作成されました。Express generatorは、Express.jsアプリケーションの基本構造を自動的に生成する公式ツールです。

## 📁 プロジェクト構造

```
Express_Pug/
├── pug-app/               # ポートフォリオサイト
│   ├── app.js            # Expressアプリケーションのメインファイル
│   ├── bin/
│   │   └── www          # サーバー起動スクリプト
│   ├── package.json     # プロジェクトの依存関係
│   ├── public/          # 静的ファイル
│   │   └── stylesheets/
│   │       └── style.css
│   ├── routes/          # ルーティング定義
│   │   └── index.js
│   ├── views/           # Pugテンプレート
│   │   ├── layout.pug   # 共通レイアウト
│   │   ├── index.pug    # ホームページ
│   │   ├── about.pug    # Aboutページ
│   │   ├── projects.pug # プロジェクトページ
│   │   ├── contact.pug  # コンタクトページ
│   │   └── error.pug    # エラーページ
│   └── PORTFOLIO_TUTORIAL.md
│
└── vote-app/              # 投票アプリケーション
    ├── app.js            # Expressアプリケーションのメインファイル
    ├── bin/
    │   └── www          # サーバー起動スクリプト
    ├── data/            # SQLiteデータベース
    ├── models/          # データモデル
    │   ├── database.js  # DB接続
    │   ├── poll.js      # 投票モデル
    │   └── vote.js      # 投票行為モデル
    ├── package.json     # プロジェクトの依存関係
    ├── public/          # 静的ファイル
    │   └── stylesheets/
    │       └── style.css
    ├── routes/          # ルーティング定義
    │   ├── index.js
    │   └── polls.js     # 投票関連ルート
    ├── views/           # Pugテンプレート
    │   ├── layout.pug   # 共通レイアウト
    │   ├── index.pug    # ホームページ
    │   └── polls/       # 投票関連ビュー
    │       ├── index.pug    # 投票一覧
    │       ├── new.pug      # 新規作成
    │       ├── show.pug     # 投票画面
    │       └── results.pug  # 結果表示
    └── VOTING_APP_TUTORIAL.md
```

## ✨ プロジェクトの特徴

### 1. ポートフォリオサイト (pug-app)

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **モダンなUI**: グラデーションヒーローセクション、カード型レイアウト
- **4つのメインページ**:
  - ホーム: ヒーローセクションと特徴紹介
  - About: 自己紹介とスキル一覧
  - Projects: プロジェクトのグリッド表示
  - Contact: お問い合わせフォーム
- **日本語対応**: 全ページが日本語化済み
- **カスタマイズ可能**: 簡単に内容やスタイルを変更可能

### 2. 投票アプリケーション (vote-app)

- **データ永続化**: SQLiteデータベースによる投票データの保存
- **投票機能**:
  - 新規投票の作成（タイトル、説明、複数選択肢）
  - オンライン投票の実施
  - リアルタイムの結果表示（パーセンテージとグラフ）
  - 投票統計の表示（総投票数、ユニーク投票者数など）
- **セキュリティ**: IPアドレスベースの重複投票防止
- **レスポンシブUI**: モバイルフレンドリーなデザイン
- **MVCアーキテクチャ**: モデル、ビュー、コントローラーの明確な分離

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

### ポートフォリオサイトのセットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/kkawailab/Express_Pug.git
cd Express_Pug/pug-app
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

### 投票アプリケーションのセットアップ

1. vote-appディレクトリに移動
```bash
cd Express_Pug/vote-app
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

### 共通技術
- **バックエンド**: Node.js, Express.js
- **テンプレートエンジン**: Pug (旧Jade)
- **スタイリング**: CSS3
- **パッケージ管理**: npm

### 投票アプリケーション追加技術
- **データベース**: SQLite3
- **ORMドライバー**: better-sqlite3
- **アーキテクチャ**: MVCパターン

## 📖 詳細なチュートリアル

各プロジェクトの作成手順について、より詳しい説明は以下のチュートリアルをご覧ください：

- **ポートフォリオサイト**: [PORTFOLIO_TUTORIAL.md](pug-app/PORTFOLIO_TUTORIAL.md)
- **投票アプリケーション**: [VOTING_APP_TUTORIAL.md](vote-app/VOTING_APP_TUTORIAL.md)

## 🤝 貢献

プルリクエストや改善提案を歓迎します！

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

Created with ❤️ using Node.js and Pug