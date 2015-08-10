'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var Promise = require('bluebird');
var GitUtils = require('../utils/git.js');

var router = express.Router();
module.exports = router;
router.get('/committers/amount', function (req, res) {
    var url = req.query.url;

    if (!url) {
        res.status(404).send('Not Found');
    } else {
        cloneRepository(url)
            .then(function (authors) {
                res.status(200).send(authors);
            });
    }

    function cloneRepository(url) {
        return GitUtils.cloneRepository(url)
            .then(function (repo) {
                return countCommitsPerComitter(repo);
            });
    }

    function countCommitsPerComitter(repo) {
        var defered = Promise.defer();

        repo.exec('log', ['--pretty=format:"%an"'], function (err, out) {
            var authors = {};
            out.split('\n')
                .forEach(function (author) {
                    if (authors[author]) {
                        authors[author]++;
                    } else {
                        authors[author] = 1;
                    }
                });

            defered.resolve(authors);
        });

        return defered.promise;
    }
});
