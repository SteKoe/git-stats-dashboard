'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var Promise = require('bluebird');
var Git = require('git-exec');
var passwordHash = require('password-hash');

module.exports = (function () {
    return {
        cloneOrPullRepository: cloneOrPullRepository
    };

    function cloneOrPullRepository(url) {
        var defered;

        if (!url) {
            defered = Promise.defer();
            defered.reject({status: 400});
            return defered.promise;
        } else {
            return _cloneOrPullRepository(url);
        }
    }

    /**
     * @param url The URL of the repository to be cloned.
     * @returns {*} Git.Repository object
     */
    function _cloneOrPullRepository(url) {
        var path = url.replace(/([a-zA-Z]*)\:\/\//, "");
        var targetPath = 'tmp/' + path;
        var defered = Promise.defer();

        var procFile = passwordHash.generate(targetPath);

        if(fs.existsSync('tmp/' + procFile)) {
            setTimeout(function() {
                console.log("Someone's working on " + url + "...");
                if(!fs.existsSync('tmp/' + procFile)) {
                    console.log(" ... finished!");
                    defered.resolve(new Git(targetPath));
                }
            }, 2500);
        } else {
            fs.writeFile('tmp/' + procFile, '', function (err) {
                if (err) return console.log(err);
            });

            console.log("Need to clone Repository...");
            Git.clone(url, targetPath, function (repo) {
                fs.unlink('tmp/' + procFile, function() {
                    defered.resolve(repo);
                });
            });
        }

        return defered.promise;
    }
})();