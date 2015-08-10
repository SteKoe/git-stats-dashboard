'use strict';

// Dependencies
var LinesPerFileService = require('./linesPerFile.js');

module.exports = function (req, res) {
    return LinesPerFileService(req, res)
        .then(function (resp) {
            console.log(resp);
        });
};
