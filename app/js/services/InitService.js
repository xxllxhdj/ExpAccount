angular.module('ExpAccount.services')

.factory('InitService', ['$q', function($q) {
    var defer = $q.defer();

    init();

    return defer.promise;

    function init() {
        var tasks = [];
        $q.all(tasks).finally(function() {
            defer.resolve();
        });
    }
}]);
