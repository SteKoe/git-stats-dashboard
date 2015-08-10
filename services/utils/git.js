'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var Promise = require('bluebird');
var Git = require('git-exec');

module.exports = (function () {
    return {
        cloneOrPullRepository: cloneOrPullRepository
    };

    /**
     * @param url The URL of the repository to be cloned.
     * @returns {*} Git.Repository object
     */
    function cloneOrPullRepository(url) {
        var path = url.replace(/([a-zA-Z]*)\:\/\//, "");
        var targetPath = 'tmp/' + path;

        var defered = Promise.defer();
        if (fs.existsSync(targetPath)) {
            console.log("Repository already cloned...");
            var repo = new Git(targetPath);
            repo.exec('pull', null, function () {
                console.log("... pulling changes!");
                defered.resolve(repo);
            });
        } else {
            console.log("Need to clone Repository...");
            Git.clone(url, targetPath, function (repo) {
                defered.resolve(repo);
            });
        }
        return defered.promise;
    }
})();