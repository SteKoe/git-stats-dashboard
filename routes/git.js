var express = require('express');
var router = express.Router();
var path = require('path');
var Git = require('git-exec');
var fs = require('fs');
var Promise = require('bluebird');

module.exports = router;

router.get('/committers/amount', function (req, res, next) {
    var url = req.query.url;

    if (!url) {
        res.status(404).send('Not Found');
    } else {
        processRequest()
            .then(function (authors) {
                res.send(authors);
            });
    }

    /**
     * Processes the request and returns a promise which resolves containing
     * the amount of commits per comitter.
     *
     * @returns {*}
     */
    function processRequest() {
        var path = url.replace(/([a-zA-Z]*)\:\/\//, "");
        var targetPath = 'tmp/' + path;
        var defered = Promise.defer();

        if (fs.existsSync(targetPath)) {
            gitLog(new Git(targetPath))
                .then(function (authors) {
                    defered.resolve(authors);
                });
        } else {
            Git.clone(url, targetPath, function (repo) {
                gitLog(repo)
                    .then(function (authors) {
                        defered.resolve(authors);
                    });
            });
        }

        return defered.promise;
    }

    /**
     * Extracts and counts all authors for the given repository.
     *
     * @param repo
     * @returns {*}
     */
    function gitLog(repo) {
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
