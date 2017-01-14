angular.module('ExpAccount.services')

.factory('InitService', ['$q', 'ReferService', 'AccountService',
    function($q, ReferService, AccountService) {
        var defer = $q.defer();

        init();

        return defer.promise;

        function init() {
            var tasks = [ReferService.init, AccountService.init];
            $q.all(tasks).finally(function() {
                defer.resolve();
            });
        }
    }
]);
