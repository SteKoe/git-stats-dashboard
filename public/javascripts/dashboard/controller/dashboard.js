angular.module('de.devjs.dashboard.git.dashboard')
    .controller('DashboardController', ['$scope', function($scope) {
        $scope.standardItems = [
            { sizeX: 2, sizeY: 1, row: 0, col: 0, style: 'color-cyan' },
            { sizeX: 2, sizeY: 2, row: 0, col: 2, style: 'color-purple' },
            { sizeX: 1, sizeY: 1, row: 0, col: 4, style: 'color-orange' },
            { sizeX: 1, sizeY: 1, row: 0, col: 5, style: 'color-salmon' },
            { sizeX: 2, sizeY: 1, row: 1, col: 0, style: 'color-cyan' },
            { sizeX: 1, sizeY: 1, row: 1, col: 4, style: 'color-purple' },
            { sizeX: 1, sizeY: 2, row: 1, col: 5, style: 'color-orange' },
            { sizeX: 1, sizeY: 1, row: 2, col: 0, style: 'color-salmon' },
            { sizeX: 2, sizeY: 1, row: 2, col: 1, style: 'color-cyan' },
            { sizeX: 1, sizeY: 1, row: 2, col: 3, style: 'color-purple' },
            { sizeX: 1, sizeY: 1, row: 2, col: 4, style: 'color-salmon' }
        ];
    }]);