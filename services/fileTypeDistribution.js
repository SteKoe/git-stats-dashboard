'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');
var glob = require('glob');

module.exports = function (url) {
    return GitUtils.cloneOrPullRepository(url)
        .then(countFileTypes)
        .catch(function(err) {
            throw new Error(err);
        });

    function countFileTypes(repo) {
        var counter = {};

        // Count FileExtensions
        glob.sync(repo.directory + '/**/*.*')
            .map(function (file) {
                return file.split('.').pop();
            })
            .filter(function (extension) {
                return getBlacklist().indexOf(extension) === -1;
            })
            .forEach(function (extension) {
                counter[extension] = (counter[extension] || 0) + 1;
            });

        // Sum all found extensions
        var sumCounter = Object.keys(counter)
            .map(function (extension) {
                return counter[extension];
            }).reduce(function (prev, cur) {
                return prev + cur;
            }, 0);

        // Make relative (percentage)
        var counter = Object.keys(counter)
            .map(function(key) {
                var res = {};
                res[key] = counter[key]/sumCounter;
                return res;
            });

        return counter;
    }

    function getBlacklist() {
        return [
            'json',
            'opts'
        ]
    }
};
