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
    
    poll.options = poll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0
    }));
    
    poll.totalVotes = totalVotes;
    
    return poll;
  }

  // 投票を終了
  static close(id) {
    const stmt = db.prepare('UPDATE polls SET is_active = 0 WHERE id = ?');
    return stmt.run(id);
  }
}

module.exports = Poll;