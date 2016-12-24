angular.module('ExpAccount.services')

.factory('ReferService', ['$q', '$timeout', function($q, $timeout) {
    var _defer = $q.defer(),
        _refer = {};

    var o = {
        init: _defer.promise
    };

    o.get = function (key) {
        return _refer[key] ? angular.copy(_refer[key]) : [];
    };

    $q.all([
        queryDocumentTypes(), 
        queryExpensePayProjects(),
        queryMarginClients(),
        queryExpenseItems(),
        queryExpensePayDepts(),
        queryExpensePayBys()
    ]).finally(function () {
        _defer.resolve();
    });

    return o;

    function queryDocumentTypes() {
        var defer = $q.defer();

        $timeout(function () {
            _refer.DocumentType = [
                { Code: 'Cash', Name: '现金报销单' },
                { Code: 'Bank', Name: '银行报销单' }
            ];
            defer.resolve();
        }, 100);

        return defer.promise;
    }
    function queryExpensePayProjects() {
        var defer = $q.defer();

        $timeout(function () {
            var t = [];
            for (var i = 10; i <= 50; i++) {
                t.push({ Code: 'ExpPj' + i, Name: '项目' + i });
            }
            _refer.ExpensePayProject = t;
            defer.resolve();
        }, 100);

        return defer.promise;
    }
    function queryMarginClients() {
        var defer = $q.defer();

        $timeout(function () {
            var t = [];
            for (var i = 10; i <= 50; i++) {
                t.push({ Code: 'MaCt' + i, Name: '客户' + i });
            }
            _refer.MarginClient = t;
            defer.resolve();
        }, 100);

        return defer.promise;
    }
    function queryExpenseItems() {
        var defer = $q.defer();

        $timeout(function () {
            var t = [];
            for (var i = 10; i <= 50; i++) {
                t.push({ Code: 'ExpItem' + i, Name: '费用项目' + i });
            }
            _refer.ExpenseItem = t;
            defer.resolve();
        }, 100);

        return defer.promise;
    }
    function queryExpensePayDepts() {
        var defer = $q.defer();

        $timeout(function () {
            var t = [{ Code: '', Name: '' }];
            for (var i = 10; i <= 50; i++) {
                t.push({ Code: 'ExpPayDept' + i, Name: '列支部门' + i });
            }
            _refer.ExpensePayDept = t;
            defer.resolve();
        }, 100);

        return defer.promise;
    }
    function queryExpensePayBys() {
        var defer = $q.defer();

        $timeout(function () {
            var t = [{ Code: '', Name: '' }];
            for (var i = 10; i <= 50; i++) {
                t.push({ Code: 'ExpPayDept' + i, Name: '列支人员' + i });
            }
            _refer.ExpensePayBy = t;
            defer.resolve();
        }, 100);

        return defer.promise;
    }
}]);