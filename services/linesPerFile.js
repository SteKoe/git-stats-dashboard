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
        });

    function linesPerFile(repo) {
        var promises = glob.sync(repo.directory + '/**/*.js')
            .map(function (file) {
                var defered = Promise.defer();
                fs.readFile(file, "utf8", function (err, code) {
                    if (!err) {
                        var stats = sloc(code, 'js');
                        defered.resolve({
                            name: file.replace(repo.directory, ''),
                            stats: stats
                        });
                    }
                });
                return defered.promise;
            });

        return Promise.all(promises)
            .then(function(fileStats) {
                return fileStats.sort(function compare(lefty, righty) {
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
