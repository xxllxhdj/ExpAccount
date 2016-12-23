angular.module('ExpAccount.services')

.factory('InitService', ['$q', 'ReferService', function($q, ReferService) {
    var defer = $q.defer();

    init();

    return defer.promise;

    function init() {
        var tasks = [ReferService.init];
        $q.all(tasks).finally(function() {
            defer.resolve();
        });
    }
}]);
