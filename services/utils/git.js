'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');
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
        mkdirp("./tmp/", function (err) {
            if (err)
                console.error(err)
        });
        var defered = Promise.defer();

        if (!fs.existsSync(targetPath)) {
            var git = require('simple-git')('./');

                git.clone(url, targetPath, function () {
                    console.log('clone done.');
                    defered.resolve(targetPath);
                });
            //
            //require('simple-git')(targetPath)
            //    .checkout('development', function (err, update) {
            //    });

        } else {
            require('simple-git')(targetPath)
                .pull(function (err, update) {
                    console.log(err, update);
                    defered.resolve(targetPath);
                });
        }
        return defered.promise;
    }
})();
