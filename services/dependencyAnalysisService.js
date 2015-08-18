'use strict';

// Dependencies
var LinesPerFileService = require('./linesPerFile.js');

var madge = require('madge');

module.exports = function (url) {
    return LinesPerFileService(url)
        .then(function (resp) {
            var dependencyObject = madge('./tmp/');
            return dependencyObject.tree;
        });
};
