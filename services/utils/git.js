'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');
var Git = require('git-exec');
var sha1 = require('sha1');
var repositoriesInProcess = {};

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
            return cloneOrSleep(url);
        }

        function cloneOrSleep(url) {
            if (repositoryIsInProcess(url)) {
                setTimeout(function () {
                    return cloneOrSleep(url);
                }, 5000);
            } else {
                return _cloneOrPullRepository(url)
                    .then(function (resp) {
                        stopProcessing(url);
                        return resp;
                    })
                    .catch(function (err) {
                        defered.reject({status: 400});
                    });
            }
        }

        function repositoryIsInProcess(url) {
            return repositoriesInProcess[JSON.stringify(url)] !== undefined;
        };
        function stopProcessing(url) {
            delete repositoriesInProcess[JSON.stringify(url)];
        };
    }

    /**
     * @param url The URL of the repository to be cloned.
     * @returns {*} Git.Repository object
     */
    function _cloneOrPullRepository(url) {
        repositoriesInProcess[JSON.stringify(url)] = 'inProcess';

        var path = url.replace(/([a-zA-Z]*)\:\/\//, "");
        var targetPath = './tmp/' + path;
        mkdirp("./tmp/", function (err) {
            if (err) console.error(err)
        });
        var defered = Promise.defer();

        if (!fs.existsSync(targetPath)) {
            Git.clone(url, targetPath, function (repo) {
                repo = new Git(targetPath);
                defered.resolve(repo);
            });
        } else {
            var repo = new Git(targetPath);
            defered.resolve(repo);
        }
        return defered.promise;
    }
})();