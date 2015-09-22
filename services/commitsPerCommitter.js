'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');

module.exports = function (url) {
    return GitUtils.cloneOrPullRepository(url)
        .then(countCommitsPerComitter)
        .catch(function(err) {
            throw new Error(err);
        });

    function countCommitsPerComitter(repo, options) {
        var options = options || {};
        var defered = Promise.defer();

        require('simple-git')(repo).log(function(err, log) {
            var authors = {};
            log.all.forEach(function (author) {
                    if (authors[author.author_name]) {
                        authors[author.author_name]++;
                    } else {
                        authors[author.author_name] = 1;
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