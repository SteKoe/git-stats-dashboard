'use strict';

// Dependencies
var express = require('express');

var router = express.Router();
module.exports = router;
router.get('/', function (req, res) {
    res.render('dashboard', {layout: 'layout_full', title: 'Express'});
});

