'use strict';

// Dependencies
var express = require('express');
var Promise = require('bluebird');

// Services
var CommitsPerComitterService = require('../services/commitsPerCommitter.js');
var LinesPerFileService = require('../services/linesPerFile.js');
var HotspotsPerPackageService = require('../services/hotspotsPerPackage.js');

// Router
var router = express.Router();
module.exports = router;

router.get('/committer/commits', function(req, res) {
    CommitsPerComitterService(req, res)
        .then(function (authors) {
            res.status(200).send(authors);
        });
});

router.get('/file/lines', function (req, res) {
    LinesPerFileService(req, res)
        .then(function (fileStats) {
            res.status(200).send(fileStats);
        });
});

router.get('/file/hotspots', function(req, res) {
    HotspotsPerPackageService(req, res)
        .then(function (resp) {
            res.status(200).send("asd");
        });
});