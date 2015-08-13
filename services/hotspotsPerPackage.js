'use strict';

// Dependencies
var LinesPerFileService = require('./linesPerFile.js');

module.exports = function (req) {
    return LinesPerFileService(req)
        .then(function (resp) {
            console.log(resp);
        });
};
