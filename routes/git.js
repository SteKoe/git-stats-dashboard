'use strict';

// Dependencies
var express = require('express');
var Promise = require('bluebird');

// Services
var CommitsPerComitterService = require('../services/commitsPerCommitter');
var LinesPerFileService = require('../services/linesPerFile');
var HotspotsPerPackageService = require('../services/hotspotsPerPackage');
var FileTypeDistribution = require('../services/fileTypeDistribution');
var AvailableRepos = require('../services/availableLocalRepositories');
var DependencyAnalysisService = require('../services/dependencyAnalysisService');
var GitUtils = require('../services/utils/git.js');

// Router
var router = express.Router();
module.exports = router;

router.get('/repositories/', function (req, res) {
       GitUtils.cloneOrPullRepository(req.query.url, req.query.checkout)
        .then(function (repo) {
            res.send(repo);
        })
        .catch(function (err) {
            res.sendStatus(err);
        });
});

router.get('/committer/commits', function (req, res) {
    CommitsPerComitterService(req.query.url, res)
        .then(function (authors) {
            res.send(authors);
        })
        .catch(function () {
            res.sendStatus(500);
        });
});

router.get('/file/lines', function (req, res) {
    LinesPerFileService(req.query.url, res)
        .then(function (fileStats) {
            res.send(fileStats);
        })
        .catch(function () {
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

router.get('/repos', function(req, res) {
    res.send(AvailableRepos());
});
