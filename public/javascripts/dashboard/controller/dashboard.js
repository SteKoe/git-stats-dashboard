angular.module('de.devjs.dashboard.git.dashboard')
    .controller('DashboardController', ['$scope', '$http', function ($scope, $http) {
        var url = "https://github.com/SteKoe/git-stats-dashboard";
        var headers = {};

        $scope.gridItems = {
            loc: {sizeX: 2, sizeY: 3, row: 0, col: 0, style: 'color-salmon'},
            committers: {sizeX: 2, sizeY: 2, row: 0, col: 2, style: 'color-cyan'},
            langStat: {sizeX: 2, sizeY: 2, row: 0, col: 4, style: 'color-orange'},
            commitsPerDay: {sizeX: 4, sizeY: 1, row: 3, col: 2, style: 'color-orange'}
        };

        $http.get('/git/committer/commits?url=' + url, headers)
            .then(function (resp) {
                $scope.committers = [];
                resp.data.forEach(function (resp) {
                    $scope.committers.push(resp);
                });
            });

        $http.get('/git/file/types?url=' + url, headers)
            .then(function (resp) {
                $scope.langStat = [];
                resp.data.forEach(function (resp) {
                    $scope.langStat.push({
                        name: Object.keys(resp)[0],
                        count: Math.round(resp[Object.keys(resp)[0]] * 1000) / 10
                    });
                });

                function getReadableTypeName(type) {

                }
            });

        $http.get('/git/file/lines?url=' + url, headers)
            .then(function (resp) {
                resp.data = resp.data.filter(function (item) {
                    // Filter out all vendors
                    return item.name.indexOf('vendor') === -1;
                }).splice(0, 20);
                $scope.linesPerFile = resp.data;
            });
    }]);