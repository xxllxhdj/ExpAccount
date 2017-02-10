
angular.module('ExpAccount.services')

.factory('User', ['$q', 'U9Service', 'APPCONSTANTS', function($q, U9Service, APPCONSTANTS) {
    var _defer = $q.defer(),
        _user = {};

    var o = {
        init: _defer.promise
    };

    o.get = function (key) {
        if (!key) {
            return angular.copy(_user);
        }
        return _user[key] ? angular.copy(_user[key]) : null;
    };

    U9Service.post(APPCONSTANTS.GetUser, {
        userCode: u9.getLoginData().UserCode
    }).then(function (user) {
        _user = user;
        _defer.resolve();
    }, function () {
        _user = {
            UserID: 1001609190006015,
            UserName: '张双',
            DeptID: 1001609140000413,
            DeptName: '规划设计总部'
        };
        _defer.resolve();
    });

    return o;
}]);
