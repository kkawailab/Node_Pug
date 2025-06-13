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