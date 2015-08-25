'use strict';

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

describe('a service that provides file dependencies', function () {

    it('should create a dependency matrix', function (done) {
        var input = {
            "anything": ["something", "anyhow"],
            "something": ["anyhow", "incoming"],
            "anyhow": []
        };
        var expected = {
            "matrix": [[0, 1, 1, 0], [0, 0, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
        };

        JSON.stringify(extractChortData(input).matrix).should.equal(JSON.stringify(expected.matrix));
        done();
    });


    it('should extract dependency item names (js files and libs)', function (done) {
        var input = {
            "anything": ["something", "anyhow"],
            "something": ["anyhow", "incoming"],
            "anyhow": []
        };
        var expected = {
            "items": [{name: 'anything'}, {name: 'something'}, {name: 'anyhow'}, {name: 'incoming'}]
        };

        JSON.stringify(extractChortData(input).items).should.equal(JSON.stringify(expected.items));
        done();
    });
})
;