'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');

var madge = require('madge');

module.exports = function (url) {
    return GitUtils.cloneOrPullRepository(url)
        .then(function (repo) {
            return obtainDependencies(repo)
        })
        .catch(function (err) {
            throw new Error(err);
        });

    function obtainDependencies(repo) {
        var defered = Promise.defer();

        var dependencyObject = madge(repo);
        defered.resolve(extractChortData(dependencyObject.tree));

        return defered.promise;
    }

//FIXME: dublicate code
    function extractChortData(data) {
        return {
            items: extractItems().map(function (item) {
                return {name: item.split("/").pop()};
            }),
            matrix: createChortMatrix()
        };

        function extractItems() {
            var items = Object.keys(data);

            items.forEach(function (key) {
                data[key].forEach(function (value, index) {
                    if (items.indexOf(value, index + 1) < 0) {
                        items.push(value);
                    }
                });
            });
            return items;
            ;
        }

        function createChortMatrix() {
            var matrix = [], items = extractItems();

            items.forEach(function () {
                var d = [], i = 0;
                while (i < items.length) {
                    d[i++] = 0;
                }
                matrix.push(d);
            });
            items.forEach(function (key, i) {
                if (data[key]) {
                    data[key].forEach(function (value, j) {
                        if (items.indexOf(value, j + 1) < 0) {
                        } else {
                            matrix[i][items.indexOf(value)] = matrix[i][items.indexOf(value)] += 1;
                            8
                        }
                    });
                }
            });
            return matrix;
        }
    }
};
