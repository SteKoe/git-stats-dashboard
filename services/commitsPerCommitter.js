'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');

module.exports = function (req, res) {
    var url = req.query.url;

    if (!url) {
        res.status(404).send('Not Found');
    } else {
        return cloneRepository(url);
    }

    function cloneRepository(url) {
        return GitUtils.cloneOrPullRepository(url)
            .then(function (repo) {
                return countCommitsPerComitter(repo);
            });
    }

    function countCommitsPerComitter(repo, options) {
        var options = options || {};
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

            var authorsToCountMax = Object.keys(authors)
                .map(function (author) {
                    return {name: author, count: authors[author]}
                });

            authorsToCountMax.sort(function compare(lefty, righty) {
                if (lefty.count < righty.count) {
                    return 1;
                } else if (lefty.count > righty.count) {
                    return -1;
                } else {
                    return 0;
                }
            });

            defered.resolve(authorsToCountMax.splice(0, options.limit || 20));
        });

        return defered.promise;
    }
};