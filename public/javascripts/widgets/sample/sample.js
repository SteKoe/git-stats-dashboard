(function() {
    var scripts = document.getElementsByTagName("script")
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('de.devjs.dashboard.git.widget.sample', [])
        .directive('sampleWidget', function() {
            return {
                restrict: 'E',
                templateUrl: currentScriptPath.replace('.js', '.html'),
                link: function(scope, element, attr) {

                }
            }
        });
})();