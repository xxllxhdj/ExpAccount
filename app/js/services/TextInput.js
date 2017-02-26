
angular.module('ExpAccount.services')

.factory('TextInput', ['$q', '$state', function($q, $state) {
    var _opts;

    return {
        show: showTextInput,
        getOpts: getOpts
    };

    function showTextInput(opts) {
        var defer = $q.defer();

        _opts = angular.copy(opts);

        _opts.title = _opts.title ? _opts.title : '';
        _opts.text = _opts.text ? _opts.text : '';

        _opts.defer = defer;

        $state.go('textinput');

        return defer.promise;
    }

    function getOpts() {
        return _opts;
    }
}]);
