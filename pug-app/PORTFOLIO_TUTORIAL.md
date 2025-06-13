# Pugを使用したポートフォリオサイト作成チュートリアル

このチュートリアルでは、Express.jsとPugテンプレートエンジンを使用して、シンプルでモダンなポートフォリオサイトを作成する手順を説明します。

## 目次
1. [プロジェクトの概要](#プロジェクトの概要)
2. [ファイル構造](#ファイル構造)
3. [ステップバイステップガイド](#ステップバイステップガイド)
4. [カスタマイズ方法](#カスタマイズ方法)
5. [トラブルシューティング](#トラブルシューティング)

## プロジェクトの概要

このポートフォリオサイトには以下の機能があります：
- レスポンシブデザイン
- 4つのページ（ホーム、About、プロジェクト、コンタクト）
- モダンなグラデーションヒーローセクション
- 固定ナビゲーションバー
- プロジェクト展示用のグリッドレイアウト
- コンタクトフォーム

## ファイル構造

```
pug-app/
├── app.js
├── bin/
│   └── www
├── package.json
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
│       └── style.css
├── routes/
│   ├── index.js
│   └── users.js
└── views/
    ├── about.pug
    ├── contact.pug
    ├── error.pug
    ├── index.pug
    ├── layout.pug
    └── projects.pug
```

## ステップバイステップガイド

### ステップ1: レイアウトテンプレートの更新

`views/layout.pug`を更新して、ナビゲーションバーとフッターを追加します。

```pug
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    meta(name='viewport' content='width=device-width, initial-scale=1.0')
  body
    nav.navbar
      .nav-container
        a.logo(href='/') Portfolio
        ul.nav-menu
          li: a(href='/') Home
          li: a(href='/about') About
          li: a(href='/projects') Projects
          li: a(href='/contact') Contact
    main.content
      block content
    footer
      .footer-container
        p &copy; 2025 My Portfolio. All rights reserved.
```

### ステップ2: ホームページの作成

`views/index.pug`を更新して、魅力的なホームページを作成します。

```pug
extends layout

block content
  section.hero
    .hero-content
      h1 Welcome to My Portfolio
      p.tagline Full Stack Developer | Creative Problem Solver
      .cta-buttons
        a.btn.btn-primary(href='/projects') View My Work
        a.btn.btn-secondary(href='/contact') Get In Touch
  
  section.highlights
    .container
      h2 What I Do
      .features
        .feature
          h3 Web Development
          p Building responsive and modern web applications using the latest technologies.
        .feature
          h3 UI/UX Design
          p Creating intuitive and beautiful user interfaces that users love.
        .feature
          h3 Problem Solving
          p Tackling complex challenges with creative and efficient solutions.
```

### ステップ3: Aboutページの作成

`views/about.pug`を新規作成します。

```pug
extends layout

block content
  section.about
    .container
      h1 About Me
      .about-content
        .about-text
          h2 Hello, I'm a Full Stack Developer
          p I'm passionate about creating digital experiences that make a difference...
          
          h3 My Skills
          .skills
            span.skill HTML/CSS
            span.skill JavaScript
            span.skill Node.js
            span.skill Express
            span.skill MongoDB
            span.skill React
            span.skill Git
```

### ステップ4: プロジェクトページの作成

`views/projects.pug`を新規作成します。

```pug
extends layout

block content
  section.projects
    .container
      h1 My Projects
      p.subtitle Here are some of the projects I've worked on
      
      .project-grid
        .project-card
          h3 E-Commerce Platform
          p A full-stack e-commerce solution with payment integration
          .tech-stack
            span Node.js
            span MongoDB
            span Stripe API
          .project-links
            a.btn-small(href='#') View Demo
            a.btn-small(href='#') GitHub
```

### ステップ5: コンタクトページの作成

`views/contact.pug`を新規作成します。

```pug
extends layout

block content
  section.contact
    .container
      h1 Get In Touch
      p.subtitle I'd love to hear from you!
      
      .contact-content
        .contact-info
          h3 Contact Information
          .info-item
            strong Email:
            span  hello@myportfolio.com
            
        .contact-form
          h3 Send Me a Message
          form(method='post' action='/contact')
            .form-group
              label(for='name') Name
              input#name(type='text' name='name' required)
            .form-group
              label(for='email') Email
              input#email(type='email' name='email' required)
            .form-group
              label(for='message') Message
              textarea#message(name='message' rows='5' required)
            button.btn.btn-primary(type='submit') Send Message
```

### ステップ6: CSSスタイルの更新

`public/stylesheets/style.css`を更新して、モダンなデザインを適用します。

主要なスタイル要素：
- リセットスタイル
- ナビゲーションバー（固定位置）
- ヒーローセクション（グラデーション背景）
- ボタンスタイル
- グリッドレイアウト（プロジェクト用）
- フォームスタイル
- レスポンシブデザイン

### ステップ7: ルーティングの設定

`routes/index.js`を更新して、新しいページへのルートを追加します。

```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Portfolio' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'My Projects' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Me' });
});

/* POST contact form. */
router.post('/contact', function(req, res, next) {
  // フォーム送信処理をここに実装
  res.redirect('/contact');
});

module.exports = router;
```

### ステップ8: アプリケーションの起動

```bash
# 依存関係のインストール
npm install

# アプリケーションの起動
npm start
```

ブラウザで `http://localhost:3000` にアクセスしてポートフォリオサイトを確認します。

## カスタマイズ方法

### 色の変更

`style.css`で以下の色を変更できます：
- ナビゲーションバー: `.navbar { background-color: #2c3e50; }`
- プライマリボタン: `.btn-primary { background-color: #3498db; }`
- ヒーローグラデーション: `.hero { background: linear-gradient(...); }`

### コンテンツの更新

各Pugファイルを編集して、自分の情報に更新します：
- `index.pug`: タグラインとフィーチャーセクション
- `about.pug`: 自己紹介とスキル
- `projects.pug`: プロジェクト情報
- `contact.pug`: 連絡先情報

### 新しいセクションの追加

1. 新しいPugファイルを`views/`フォルダに作成
2. `routes/index.js`に新しいルートを追加
3. ナビゲーションメニューにリンクを追加

## トラブルシューティング

### よくある問題

1. **モジュールが見つからないエラー**
   ```bash
   npm install
   ```

2. **ポート3000が使用中**
   ```bash
   PORT=3001 npm start
   ```

3. **スタイルが適用されない**
   - ブラウザのキャッシュをクリア
   - CSSファイルのパスを確認

### デバッグのヒント

- ブラウザの開発者ツールでコンソールエラーを確認
- `npm start`の出力でサーバーエラーを確認
- Pugのインデントが正しいか確認（スペース2つ）

## 次のステップ

- データベース連携（MongoDB/PostgreSQL）
- 認証機能の追加
- ブログ機能の実装
- SEO最適化
- パフォーマンス最適化
- デプロイ（Heroku/Vercel/Railway）

このチュートリアルを参考に、自分だけのポートフォリオサイトを作成してください！