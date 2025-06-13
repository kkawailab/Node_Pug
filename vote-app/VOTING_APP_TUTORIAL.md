# Express.js + SQLite + Pugで作る投票アプリケーション チュートリアル

## 目次
1. [はじめに](#はじめに)
2. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
3. [データベース設計](#データベース設計)
4. [モデルの実装](#モデルの実装)
5. [ルーティングとコントローラー](#ルーティングとコントローラー)
6. [ビューの作成](#ビューの作成)
7. [スタイリング](#スタイリング)
8. [動作確認とテスト](#動作確認とテスト)
9. [まとめと発展](#まとめと発展)

## はじめに

このチュートリアルでは、Express.js、SQLite、Pugを使用して、フル機能の投票アプリケーションを作成する方法を学びます。

### 作成するアプリケーションの機能
- 投票の作成・管理
- 複数選択肢の投票
- リアルタイムの結果表示
- 重複投票の防止
- 投票統計の表示

### 必要な技術スタック
- **Node.js**: JavaScriptランタイム
- **Express.js**: Webアプリケーションフレームワーク
- **SQLite**: 軽量データベース
- **Pug**: テンプレートエンジン
- **better-sqlite3**: SQLiteのNode.jsドライバー

## プロジェクトのセットアップ

### 1. Express Generatorでプロジェクトを作成

```bash
# Express generatorを使用してプロジェクトを作成
npx express-generator --view=pug vote-app

# プロジェクトディレクトリに移動
cd vote-app

# 基本的な依存関係をインストール
npm install
```

### 2. SQLite関連のパッケージをインストール

```bash
# SQLiteドライバーをインストール
npm install better-sqlite3

# オプション: sqlite3も併用する場合
npm install sqlite3
```

### 3. ディレクトリ構造の準備

```bash
# データベースファイル用のディレクトリを作成
mkdir data

# モデル用のディレクトリを作成
mkdir models

# ビュー用のサブディレクトリを作成
mkdir views/polls
```

最終的なディレクトリ構造：
```
vote-app/
├── app.js              # メインアプリケーションファイル
├── bin/
│   └── www            # サーバー起動スクリプト
├── data/              # SQLiteデータベースファイル
├── models/            # データモデル
│   ├── database.js    # データベース接続
│   ├── poll.js        # 投票モデル
│   └── vote.js        # 投票行為モデル
├── public/            # 静的ファイル
│   └── stylesheets/
│       └── style.css  # スタイルシート
├── routes/            # ルーティング
│   ├── index.js       # ホームページ
│   └── polls.js       # 投票関連のルート
└── views/             # Pugテンプレート
    ├── layout.pug     # 共通レイアウト
    ├── index.pug      # ホームページ
    └── polls/         # 投票関連のビュー
        ├── index.pug  # 投票一覧
        ├── new.pug    # 新規作成
        ├── show.pug   # 投票画面
        └── results.pug # 結果表示
```

## データベース設計

### データベーススキーマ

投票アプリケーションには3つの主要なテーブルが必要です：

#### 1. polls（投票）テーブル
```sql
CREATE TABLE polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,              -- 投票のタイトル
    description TEXT,                 -- 投票の説明（任意）
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME,                 -- 終了日時（任意）
    is_active BOOLEAN DEFAULT 1       -- 有効/無効フラグ
);
```

#### 2. options（選択肢）テーブル
```sql
CREATE TABLE options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,         -- 関連する投票のID
    option_text TEXT NOT NULL,        -- 選択肢のテキスト
    vote_count INTEGER DEFAULT 0,     -- 投票数
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);
```

#### 3. votes（投票履歴）テーブル
```sql
CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    voter_ip TEXT,                    -- 投票者のIPアドレス
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
);
```

### データベース接続の実装

`models/database.js`:
```javascript
const Database = require('better-sqlite3');
const path = require('path');

// データベースファイルのパスを設定
const dbPath = path.join(__dirname, '../data/voting.db');

// データベースインスタンスを作成
const db = new Database(dbPath);

// テーブルの作成
db.exec(`
  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    voter_ip TEXT,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
  );
`);

module.exports = db;
```

## モデルの実装

### Pollモデル

`models/poll.js`:
```javascript
const db = require('./database');

class Poll {
  // 全ての有効な投票を取得
  static getAllActive() {
    const stmt = db.prepare(`
      SELECT p.*, 
        (SELECT SUM(vote_count) FROM options WHERE poll_id = p.id) as total_votes
      FROM polls p 
      WHERE p.is_active = 1 
      ORDER BY p.created_at DESC
    `);
    return stmt.all();
  }

  // IDで投票を取得（選択肢も含む）
  static getById(id) {
    const pollStmt = db.prepare('SELECT * FROM polls WHERE id = ?');
    const poll = pollStmt.get(id);
    
    if (!poll) return null;
    
    const optionsStmt = db.prepare('SELECT * FROM options WHERE poll_id = ? ORDER BY id');
    poll.options = optionsStmt.all(id);
    
    return poll;
  }

  // 新しい投票を作成
  static create(title, description, options, endsAt = null) {
    const insertPoll = db.prepare(`
      INSERT INTO polls (title, description, ends_at) 
      VALUES (?, ?, ?)
    `);
    
    const insertOption = db.prepare(`
      INSERT INTO options (poll_id, option_text) 
      VALUES (?, ?)
    `);
    
    // トランザクションを使用して整合性を保つ
    const result = db.transaction(() => {
      const pollResult = insertPoll.run(title, description, endsAt);
      const pollId = pollResult.lastInsertRowid;
      
      for (const optionText of options) {
        insertOption.run(pollId, optionText);
      }
      
      return pollId;
    })();
    
    return result;
  }

  // 投票結果を取得
  static getResults(pollId) {
    const poll = this.getById(pollId);
    if (!poll) return null;
    
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);
    
    // パーセンテージを計算
    poll.options = poll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0
    }));
    
    poll.totalVotes = totalVotes;
    
    return poll;
  }
}

module.exports = Poll;
```

### Voteモデル

`models/vote.js`:
```javascript
const db = require('./database');

class Vote {
  // 投票を記録
  static cast(pollId, optionId, voterIp) {
    // 同じIPから同じ投票への重複投票をチェック
    const checkStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM votes 
      WHERE poll_id = ? AND voter_ip = ?
    `);
    
    const existing = checkStmt.get(pollId, voterIp);
    
    if (existing.count > 0) {
      return { success: false, message: 'すでに投票済みです' };
    }
    
    // 投票を記録し、選択肢のカウントを更新
    const insertVote = db.prepare(`
      INSERT INTO votes (poll_id, option_id, voter_ip) 
      VALUES (?, ?, ?)
    `);
    
    const updateOption = db.prepare(`
      UPDATE options 
      SET vote_count = vote_count + 1 
      WHERE id = ?
    `);
    
    try {
      db.transaction(() => {
        insertVote.run(pollId, optionId, voterIp);
        updateOption.run(optionId);
      })();
      
      return { success: true, message: '投票が完了しました' };
    } catch (error) {
      return { success: false, message: '投票中にエラーが発生しました' };
    }
  }

  // ユーザーが特定の投票に投票済みかチェック
  static hasVoted(pollId, voterIp) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM votes 
      WHERE poll_id = ? AND voter_ip = ?
    `);
    
    const result = stmt.get(pollId, voterIp);
    return result.count > 0;
  }

  // 投票の詳細統計を取得
  static getStats(pollId) {
    const stmt = db.prepare(`
      SELECT 
        COUNT(DISTINCT voter_ip) as unique_voters,
        COUNT(*) as total_votes,
        MIN(voted_at) as first_vote,
        MAX(voted_at) as last_vote
      FROM votes 
      WHERE poll_id = ?
    `);
    
    return stmt.get(pollId);
  }
}

module.exports = Vote;
```

## ルーティングとコントローラー

### ルーティングの設定

`routes/polls.js`:
```javascript
const express = require('express');
const router = express.Router();
const Poll = require('../models/poll');
const Vote = require('../models/vote');

// 投票一覧ページ
router.get('/', function(req, res, next) {
  try {
    const polls = Poll.getAllActive();
    res.render('polls/index', { 
      title: '投票一覧',
      polls: polls 
    });
  } catch (error) {
    next(error);
  }
});

// 新規投票作成フォーム
router.get('/new', function(req, res, next) {
  res.render('polls/new', { 
    title: '新規投票作成' 
  });
});

// 新規投票作成処理
router.post('/new', function(req, res, next) {
  const { title, description, options } = req.body;
  
  // 選択肢の配列化と空白除去
  const optionsList = options
    .split('\n')
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);
  
  if (optionsList.length < 2) {
    return res.render('polls/new', {
      title: '新規投票作成',
      error: '選択肢は2つ以上必要です'
    });
  }
  
  try {
    const pollId = Poll.create(title, description, optionsList);
    res.redirect(`/polls/${pollId}`);
  } catch (error) {
    next(error);
  }
});

// 投票詳細・投票ページ
router.get('/:id', function(req, res, next) {
  const pollId = req.params.id;
  const voterIp = req.ip;
  
  try {
    const poll = Poll.getById(pollId);
    
    if (!poll) {
      return res.status(404).render('error', {
        message: '投票が見つかりません',
        error: { status: 404 }
      });
    }
    
    const hasVoted = Vote.hasVoted(pollId, voterIp);
    
    res.render('polls/show', {
      title: poll.title,
      poll: poll,
      hasVoted: hasVoted,
      message: req.query.message
    });
  } catch (error) {
    next(error);
  }
});

// 投票処理
router.post('/:id/vote', function(req, res, next) {
  const pollId = req.params.id;
  const optionId = req.body.optionId;
  const voterIp = req.ip;
  
  try {
    const result = Vote.cast(pollId, optionId, voterIp);
    
    if (result.success) {
      res.redirect(`/polls/${pollId}/results?message=${encodeURIComponent(result.message)}`);
    } else {
      res.redirect(`/polls/${pollId}?message=${encodeURIComponent(result.message)}`);
    }
  } catch (error) {
    next(error);
  }
});

// 投票結果ページ
router.get('/:id/results', function(req, res, next) {
  const pollId = req.params.id;
  
  try {
    const poll = Poll.getResults(pollId);
    
    if (!poll) {
      return res.status(404).render('error', {
        message: '投票が見つかりません',
        error: { status: 404 }
      });
    }
    
    const stats = Vote.getStats(pollId);
    
    res.render('polls/results', {
      title: `${poll.title} - 結果`,
      poll: poll,
      stats: stats,
      message: req.query.message
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### アプリケーションへのルート登録

`app.js`に以下を追加：
```javascript
// ルーターのインポート
var pollsRouter = require('./routes/polls');

// ルーターの登録
app.use('/polls', pollsRouter);
```

## ビューの作成

### 共通レイアウト

`views/layout.pug`:
```pug
doctype html
html(lang='ja')
  head
    title= title
    meta(charset='UTF-8')
    meta(name='viewport' content='width=device-width, initial-scale=1.0')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    nav.navbar
      .container
        a.logo(href='/') 投票アプリ
        ul.nav-menu
          li: a(href='/') ホーム
          li: a(href='/polls') 投票一覧
          li: a(href='/polls/new') 新規作成
    main.content
      .container
        block content
    footer
      .container
        p &copy; 2025 投票アプリ - Express & SQLite
```

### ホームページ

`views/index.pug`:
```pug
extends layout

block content
  h1 投票アプリへようこそ
  p このアプリケーションでは、簡単にオンライン投票を作成・管理できます。
  
  .hero-section
    h2 主な機能
    ul
      li 投票の作成と管理
      li リアルタイムの投票結果表示
      li 重複投票の防止
      li シンプルで使いやすいインターフェース
  
  .cta-buttons
    a.btn.btn-primary(href='/polls') 投票一覧を見る
    a.btn.btn-secondary(href='/polls/new') 新しい投票を作成
```

### 投票一覧

`views/polls/index.pug`:
```pug
extends ../layout

block content
  h1 投票一覧
  
  if polls && polls.length > 0
    .polls-grid
      each poll in polls
        .poll-card
          h3= poll.title
          if poll.description
            p.description= poll.description
          .poll-meta
            p 作成日: #{new Date(poll.created_at).toLocaleDateString('ja-JP')}
            p 総投票数: #{poll.total_votes || 0}票
          .poll-actions
            a.btn.btn-primary(href=`/polls/${poll.id}`) 投票する
            a.btn.btn-secondary(href=`/polls/${poll.id}/results`) 結果を見る
  else
    .empty-state
      p まだ投票がありません。
      a.btn.btn-primary(href='/polls/new') 最初の投票を作成する
```

### 新規投票作成フォーム

`views/polls/new.pug`:
```pug
extends ../layout

block content
  h1 新規投票作成
  
  if error
    .error-message
      p= error
  
  form(method='post' action='/polls/new')
    .form-group
      label(for='title') 投票タイトル
      input#title(type='text' name='title' required placeholder='例: 好きな果物は？')
    
    .form-group
      label(for='description') 説明（任意）
      textarea#description(name='description' rows='3' placeholder='投票についての詳細な説明を入力してください')
    
    .form-group
      label(for='options') 選択肢（1行に1つずつ入力）
      textarea#options(name='options' rows='5' required placeholder='りんご\nオレンジ\nバナナ\nぶどう')
      small.help-text 最低2つ以上の選択肢を入力してください
    
    .form-actions
      button.btn.btn-primary(type='submit') 投票を作成
      a.btn.btn-secondary(href='/polls') キャンセル
```

### 投票画面

`views/polls/show.pug`:
```pug
extends ../layout

block content
  h1= poll.title
  
  if poll.description
    p.poll-description= poll.description
  
  if message
    .message-box
      p= message
  
  if hasVoted
    .already-voted
      p すでにこの投票に参加済みです。
      a.btn.btn-primary(href=`/polls/${poll.id}/results`) 結果を見る
  else
    form(method='post' action=`/polls/${poll.id}/vote`)
      .options-list
        each option in poll.options
          .option-item
            input(type='radio' name='optionId' value=option.id id=`option-${option.id}` required)
            label(for=`option-${option.id}`)= option.option_text
      
      .form-actions
        button.btn.btn-primary(type='submit') 投票する
        a.btn.btn-secondary(href=`/polls/${poll.id}/results`) 結果を見る（投票せずに）
```

### 結果表示画面

`views/polls/results.pug`:
```pug
extends ../layout

block content
  h1 #{poll.title} - 投票結果
  
  if poll.description
    p.poll-description= poll.description
  
  if message
    .message-box.success
      p= message
  
  .results-container
    if poll.totalVotes > 0
      each option in poll.options
        .result-item
          .result-header
            span.option-text= option.option_text
            span.vote-count #{option.vote_count}票 (#{option.percentage}%)
          .result-bar
            .result-bar-fill(style=`width: ${option.percentage}%`)
    else
      p.no-votes まだ投票がありません。
  
  .statistics
    h3 統計情報
    ul
      li 総投票数: #{poll.totalVotes || 0}票
      if stats
        li ユニーク投票者数: #{stats.unique_voters || 0}人
        if stats.first_vote
          li 最初の投票: #{new Date(stats.first_vote).toLocaleString('ja-JP')}
        if stats.last_vote
          li 最後の投票: #{new Date(stats.last_vote).toLocaleString('ja-JP')}
  
  .actions
    a.btn.btn-primary(href=`/polls/${poll.id}`) 投票ページに戻る
    a.btn.btn-secondary(href='/polls') 投票一覧に戻る
```

## スタイリング

`public/stylesheets/style.css`の主要部分：

```css
/* リセットと基本設定 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font: 16px "Hiragino Sans", "Meiryo", sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
}

/* ナビゲーションバー */
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ボタン */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

/* 投票カード */
.poll-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

/* 投票結果のバー */
.result-bar {
  background-color: #ecf0f1;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
}

.result-bar-fill {
  background-color: #3498db;
  height: 100%;
  transition: width 0.5s ease;
}
```

## 動作確認とテスト

### アプリケーションの起動

```bash
# 開発モードで起動
npm start

# または、nodemonを使用（ファイル変更を自動検出）
nodemon
```

### 動作確認のチェックリスト

1. **投票の作成**
   - `/polls/new`にアクセス
   - タイトル、説明、選択肢を入力
   - 投票が正常に作成されることを確認

2. **投票の実行**
   - 作成した投票の詳細ページにアクセス
   - 選択肢を選んで投票
   - 結果ページにリダイレクトされることを確認

3. **重複投票の防止**
   - 同じ投票に再度アクセス
   - 「すでに投票済み」メッセージが表示されることを確認

4. **結果の表示**
   - 投票結果ページで正しいパーセンテージが表示されることを確認
   - 統計情報が正しく表示されることを確認

### 一般的なエラーと対処法

1. **データベースエラー**
   ```
   Error: SQLITE_CANTOPEN: unable to open database file
   ```
   対処法: `data`ディレクトリが存在することを確認

2. **ルーティングエラー**
   ```
   Cannot GET /polls
   ```
   対処法: `app.js`でルーターが正しく登録されているか確認

3. **テンプレートエラー**
   ```
   Error: Failed to lookup view "polls/index"
   ```
   対処法: ビューファイルのパスと名前を確認

## まとめと発展

### 学んだこと

1. **Express.js**の基本的な使い方
   - ルーティング
   - ミドルウェア
   - エラーハンドリング

2. **SQLite**でのデータ管理
   - テーブル設計
   - リレーション
   - トランザクション

3. **Pug**テンプレートエンジン
   - レイアウトの継承
   - 条件分岐とループ
   - 変数の展開

### 発展的な機能の追加アイデア

1. **ユーザー認証**
   - ログイン機能の追加
   - 投票の作成者管理

2. **投票の拡張機能**
   - 複数選択可能な投票
   - 期限付き投票
   - 非公開投票

3. **リアルタイム更新**
   - WebSocketを使用したリアルタイム結果更新
   - 投票の通知機能

4. **管理機能**
   - 投票の編集・削除
   - 不正投票の検出
   - 詳細な分析ダッシュボード

5. **APIの実装**
   - RESTful APIの追加
   - 外部アプリケーションとの連携

### 参考リソース

- [Express.js公式ドキュメント](https://expressjs.com/)
- [SQLite公式サイト](https://www.sqlite.org/)
- [Pug公式ドキュメント](https://pugjs.org/)
- [better-sqlite3 GitHub](https://github.com/WiseLibs/better-sqlite3)

このチュートリアルを通じて、フルスタックのWebアプリケーション開発の基礎を学ぶことができました。ここで学んだ知識を基に、さらに高度な機能を追加して、独自のアプリケーションを作成してみてください。