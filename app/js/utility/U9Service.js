
angular.module('ExpAccount.utility')

.factory('U9Service', ['$q', '$http', function($q, $http) {
    return {
        post: u9Post
    };

    function u9Post(svName, params) {
        var defer = $q.defer();

        var connect = u9.getConnectSetting(),
        	url = 'http://' + connect.address + ':' + connect.port + '/u9_gateway/RestServices/' + svName + '.svc/Do',
            ps = {
                context: u9.getLoginData()
            };
        if (params) {
            angular.extend(ps, params);
        }
        $http.post(url, ps).success(function(data) {
            defer.resolve(data.d);
        }).error(function(err) {
            defer.reject(err);
        });

        return defer.promise;
    }
}]);
