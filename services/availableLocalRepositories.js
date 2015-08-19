'use strict';

var glob = require('glob');

// Dependencies
module.exports = function () {
    return glob.sync('./tmp/**/.git')
        .map(function (file) {
           return file.replace('/.git', '').replace('./tmp/','');
        });
};
