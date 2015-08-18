angular.module('de.devjs.dashboard.git.dashboard')
    .controller('DashboardController', ['$scope', '$http', function ($scope, $http) {
        $scope.url = "https://github.com/SteKoe/git-stats-dashboard";
        var headers = {};

        $scope.gridItems = {
            loc: {sizeX: 2, sizeY: 3, row: 0, col: 0, style: 'color-salmon'},
            committers: {sizeX: 2, sizeY: 2, row: 0, col: 2, style: 'color-cyan'},
            langStat: {sizeX: 2, sizeY: 2, row: 0, col: 4, style: 'color-orange'},
            commitsPerDay: {sizeX: 4, sizeY: 1, row: 3, col: 2, style: 'color-orange'}
        };

        $scope.gridsterOpts = {
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false
            }
        };

        $scope.runStats = function() {
            $http.get('/git/committer/commits?url=' + $scope.url, headers)
                .then(function (resp) {
                    $scope.committers = [];
                    resp.data.forEach(function (resp) {
                        $scope.committers.push(resp);
                    });
                });

            $http.get('/git/file/types?url=' + $scope.url, headers)
                .then(function (resp) {
                    $scope.langStat = [];
                    resp.data.forEach(function (resp) {
                        var key = Object.keys(resp)[0];



                        $scope.langStat.push({
                            name: getReadableTypeName(key),
                            count: Math.round(resp[key] * 1000) / 10
                        });
                    });

                    function getReadableTypeName(type) {
                        var typeName = {
                            'js': 'JavaScript',
                            'hbs': 'Handlebars.js'
                        };

                        return typeName[type] || type.toUpperCase();
                    }
                });

            $http.get('/git/file/lines?url=' + $scope.url, headers)
                .then(function (resp) {
                    resp.data = resp.data.filter(function (item) {
                        return item.name.indexOf('vendor') === -1;
                    }).splice(0, 20);
                    $scope.linesPerFile = resp.data;
                });

            $http.get('/git/file/hotspots?url=' + $scope.url, headers)
                .then(function (resp) {
                    $scope.hotspotsPerFile = resp.data;
                });

            $http.get('/git/file/dependencies?url=' + $scope.url, headers)
                .then(function (resp) {
                    $scope.dependencies = resp.data;
                });
        }

        $scope.runStats();

    }]);