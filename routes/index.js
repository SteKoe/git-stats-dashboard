var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('dashboard', { layout: 'layout_full', title: 'Express' });
});

module.exports = router;
