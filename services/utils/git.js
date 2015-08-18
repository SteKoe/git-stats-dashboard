'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');
var Git = require('git-exec');
var sha1 = require('sha1');

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
        var targetPath = './tmp/' + path;
        var procFile = sha1(targetPath);
        console.log(path, procFile);
        procFile = './tmp/' + procFile;

        mkdirp("./tmp/", function (err) {
            if (err) console.error(err)
        });

        var defered = Promise.defer();

        if (!fs.existsSync(procFile)) {
            fs.writeFileSync(procFile, '1337');
            fs.chmodSync(procFile, '0777');

            if (!fs.existsSync(targetPath)) {
                Git.clone(url, targetPath, function (repo) {
                    repo = new Git(targetPath);

                    fs.unlink(procFile, function (err) {
                        if (err) console.error(err);

                        console.log("done...");
                        defered.resolve(repo);
                    });

                });
            } else {
                var repo = new Git(targetPath);
                defered.resolve(repo);
            }
        }

        if (fs.existsSync(procFile)) {
            asd(procFile);
        }

        function asd(procFile) {
            console.log("Someone's working on " + url + "...");
            if (!fs.existsSync(procFile)) {
                console.log(" ... finished!");
                var repo = new Git(targetPath);
                defered.resolve(repo);
            } else {
                setTimeout(asd, 1500);
            }
        }

        return defered.promise;
    }
})();