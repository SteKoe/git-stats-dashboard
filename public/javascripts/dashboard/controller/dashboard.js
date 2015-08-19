angular.module('de.devjs.dashboard.git.dashboard')
    .controller('DashboardController', ['$scope', '$http', '$base64', function ($scope, $http, $base64) {
        $scope.url = "https://github.com/SteKoe/git-stats-dashboard";
        var headers = {};

        $scope.gridItems = {
            loc: {sizeX: 4, sizeY: 7, row: 0, col: 0, style: 'color-salmon'},
            committers: {sizeX: 4, sizeY: 3, row: 0, col: 4, style: 'color-cyan'},
            langStat: {sizeX: 4, sizeY: 3, row: 0, col: 8, style: 'color-orange'},
            codeflower: {sizeX: 4, sizeY: 4, row: 3, col: 4, style: 'color-orange'},
            dependencyAnalyser: {sizeX: 4, sizeY: 4, row: 3, col: 8, style: 'color-orange'}
        };

        $scope.gridsterOpts = {
            columns: 12,
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false
            }
        };

        $scope.retrieveExistingRepos = function () {
            $http.get('/git/repos')
                .then(function (resp) {
                    $scope.repos = resp.data;
                });
        };
        $scope.retrieveExistingRepos();


        $scope.runStats = function () {

            if ($scope.username && $scope.password) {
                headers.common = {};
                headers.common['Authorization'] = 'Basic ' + $base64.encode($scope.username + ':' + $scope.password);
            }

            $http.get('/git/committer/commits?url=' + $scope.url, headers)
                .then(function (resp) {
                    $scope.committers = [];
                    resp.data.forEach(function (resp) {
                        $scope.committers.push(resp);
                    });
                })
                .then(function () {
                    return $http.get('/git/file/types?url=' + $scope.url, headers)
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
                })
                .then(function () {
                    return $http.get('/git/file/lines?url=' + $scope.url, headers)
                        .then(function (resp) {
                            resp.data = resp.data.filter(function (item) {
                                return item.name.indexOf('vendor') === -1;
                            }).splice(0, 20);
                            $scope.linesPerFile = resp.data;
                        });
                })
                .then(function () {
                    return $http.get('/git/file/hotspots?url=' + $scope.url, headers)
                        .then(function (resp) {
                            $scope.hotspotsPerFile = resp.data;
                        });
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