
angular.module('ExpAccount.services')

.factory('LgSelect', ['$q', '$state', function($q, $state) {
    var _opts;

    return {
        show: showLgSelect,
        getOpts: getOpts
    };

    function showLgSelect(opts) {
        var defer = $q.defer();

        _opts = angular.copy(opts);

        _opts.title = _opts.title ? _opts.title : '';
        _opts.displayField = _opts.displayField ? _opts.displayField : 'name';

        _opts.defer = defer;

        $state.go('lgselect');

        return defer.promise;
    }

    function getOpts() {
        return _opts;
    }
}]);