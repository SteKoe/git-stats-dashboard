'use strict';

// Dependencies
var GitUtils = require('./utils/git.js');

var madge = require('madge');

module.exports = function (url) {
    return GitUtils.cloneOrPullRepository(url)
        .then(function (repo) {
            return obtainDependencies(repo)
        });

    function obtainDependencies(repo) {
        var dependencyObject = madge(repo.directory);
        return extractChortData(dependencyObject.tree);
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
            var matrix = [];
            extractItems().forEach(function () {
                var d = [], i = 0;
                while (i < extractItems().length) {
                    d[i++] = 0;
                }
                matrix.push(d);
            });
            extractItems().forEach(function (key, i) {
                if (data[key]) {
                    data[key].forEach(function (value, j) {
                        if (extractItems().indexOf(value, j + 1) < 0) {
                        } else {
                            matrix[i][extractItems().indexOf(value)] = matrix[i][extractItems().indexOf(value)] += 1;
                        }
                    });
                }
            });
            return matrix;
        }
    }
};
