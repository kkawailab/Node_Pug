var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '投票アプリ - ホーム' });
});

module.exports = router;
