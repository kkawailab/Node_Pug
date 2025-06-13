var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'マイポートフォリオ' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: '自己紹介 | マイポートフォリオ' });
});

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', { title: 'プロジェクト | マイポートフォリオ' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'お問い合わせ | マイポートフォリオ' });
});

/* POST contact form. */
router.post('/contact', function(req, res, next) {
  // In a real application, you would handle the form submission here
  // For now, we'll just redirect back to the contact page
  res.redirect('/contact');
});

module.exports = router;
