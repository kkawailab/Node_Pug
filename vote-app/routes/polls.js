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