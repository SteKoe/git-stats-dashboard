'use strict';

// Dependencies
var LinesPerFileService = require('./linesPerFile.js');

module.exports = function (url) {
    return LinesPerFileService(url)
        .then(function (resp) {
            return fillHotspotsInTree(resp);
        });

    //TODO: redundant code, inject logik in Test/hotspotsPerPackageService.js
    function fillHotspotsInTree(data) {
        var tree = {};

        function fillTree(name, steps) {
            var current = null,
                existing = null,
                i = 0;
            for (var y = 0; y < steps.length-1; y++) {
                if (y == 0) {
                    if (!tree.children || typeof tree.children == 'undefined') {
                        tree = {name: steps[y], children: []};
                    }
                    current = tree.children;
                } else {
                    existing = null;
                    for (i = 0; i < current.length; i++) {
                        if (current[i].name === steps[y]) {
                            existing = current[i];
                            break;
                        }
                    }
                    if (existing) {
                        current = existing.children;
                    } else {
                        current.push({name: steps[y], children: []});
                        current = current[current.length - 1].children;
                    }
                }
            }
            current.push({name: steps[steps.length-1], count: name})
        }

        for (var x=0; x < data.length; x++) {
            var steps = data[x].name.split('/').splice(1);
            if(steps.length > 1) {
                fillTree(data[x].stats.total, steps)
            }
        }
        return tree;
    };
};
