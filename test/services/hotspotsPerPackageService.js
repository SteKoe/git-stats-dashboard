'use strict';

function identifyHotspots(resp) {
    var result = {};

    resp.forEach(function (i) {
        result.name = i.name;
        result.children = [];
        result.count = i.stats.total;
    });
    return result;
};

xdescribe('hotspots per package test', function () {
    it('should transfrom to json tree structure', function (done) {
        var input = [{
            "name": "/d3.js",
            "stats": {"total": 235, "source": 199, "comment": 4, "single": 0, "block": 4, "mixed": 0, "empty": 32}
        }, {
            "name": "/1/2/store.spec.js",
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
                ]}]};

        JSON.stringify(identifyHotspots(input)).should.equal(JSON.stringify(expected));
        done();
    });
});