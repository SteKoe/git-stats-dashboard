'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');
var glob = require('glob');
var sloc = require('sloc');
var fs = require('fs');

module.exports = function (url) {
    return GitUtils.cloneOrPullRepository(url)
        .then(function (repo) {
            return linesPerFile(repo);
        })
        .catch(function (err) {
            throw new Error(err);
        });

    function linesPerFile(repo) {
        var promises = glob.sync(repo + '/**/*.*')
            .map(function (file) {
                var defered = Promise.defer();
                fs.readFile(file, "utf8", function (err, code) {
                    if (!err) {
                        try {
                            var stats = sloc(code, file.split(".").pop());
                            defered.resolve({
                                name: file.replace(repo, ''),
                                stats: stats
                            });
                        } catch (e) {
                            // This isn't actually an Execption.
                            defered.resolve();
                        }
                    }
                });
                return defered.promise;
            });

        return Promise.all(promises)
            .then(function (fileStats) {
                return fileStats
                    .filter(function (stats) {
                        return typeof stats !== "undefined";
                    })
                    .sort(function compare(lefty, righty) {
                        if (lefty.stats.total < righty.stats.total) {
                            return 1;
                        } else if (lefty.stats.total > righty.stats.total) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
            });
    }
};
