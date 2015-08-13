'use strict';

function fillHotspotsInTree(data) {
    var tree = {};

    for (var x=0; x < data.length; x++) {
        var steps = data[x].name.split('/').splice(1);
        if(steps.length > 1) {
            fillTree(data[x].stats.total, steps)
        }
    }
    return tree;

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
};

describe('hotspots per package test', function () {
    it('should transfrom to json tree structure', function (done) {
        var input = [{
            "name": "/d3.js",
            "stats": {"total": 235, "source": 199, "comment": 4, "single": 0, "block": 4, "mixed": 0, "empty": 32}
        }, {
            "name": "/1/2/store.js",
            "stats": {"total": 185, "source": 142, "comment": 11, "single": 11, "block": 0, "mixed": 7, "empty": 39}
        }, {
            "name": "/1/2/flore.js",
            "stats": {"total": 116, "source": 101, "comment": 4, "single": 4, "block": 0, "mixed": 4, "empty": 15}
        }
        ];
        var expected = {
            "name": "1",
            "children": [{
                "name": "2",
                "children": [
                    {"name": "store.js", "count": 185},
                    {"name": "flore.js", "count": 116}
                ]
            }]
        };

        JSON.stringify(fillHotspotsInTree(input)).should.equal(JSON.stringify(expected));
        done();
    });
});