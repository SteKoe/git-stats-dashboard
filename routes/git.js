'use strict';

// Dependencies
var express = require('express');
var Promise = require('bluebird');

// Services
var CommitsPerComitterService = require('../services/commitsPerCommitter.js');
var LinesPerFileService = require('../services/linesPerFile.js');
var HotspotsPerPackageService = require('../services/hotspotsPerPackage.js');
var FileTypeDistribution = require('../services/fileTypeDistribution.js');
var DependencyAnalysisService = require('../services/dependencyAnalysisService.js');

// Router
var router = express.Router();
module.exports = router;

router.get('/committer/commits', function (req, res) {
    CommitsPerComitterService(req.query.url, res)
        .then(function (authors) {
            res.send(authors);
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});

router.get('/file/lines', function (req, res) {
    LinesPerFileService(req.query.url, res)
        .then(function (fileStats) {
            res.send(fileStats);
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});

router.get('/file/hotspots', function (req, res) {
    HotspotsPerPackageService(req.query.url, res)
        .then(function (resp) {
            res.send(resp);
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});

router.get('/file/types', function (req, res) {
    FileTypeDistribution(req.query.url)
        .then(function (resp) {
            res.send(resp);
        });
});


router.get('/file/dependencies', function (req, res) {
    DependencyAnalysisService(req.query.url, res)
        .then(function (resp) {
            res.send(resp);
        })
        .catch(function (err) {
            res.sendStatus(500);
        });
});