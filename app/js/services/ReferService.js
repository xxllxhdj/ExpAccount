angular.module('ExpAccount.services')

.factory('ReferService', ['$q', 'U9Service', 'APPCONSTANTS', 
    function($q, U9Service, APPCONSTANTS) {
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

            U9Service.post(APPCONSTANTS.GetDocumentType, {
                DocType: APPCONSTANTS.DocType
            }).then(function (documentTypes) {
                _refer.DocumentType = documentTypes;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
        function queryExpensePayProjects() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetProject).then(function (projects) {
                _refer.ExpensePayProject = projects;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
        function queryMarginClients() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetBondCustomer).then(function (clients) {
                _refer.MarginClient = clients;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
        function queryExpenseItems() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetCostProject).then(function (items) {
                _refer.ExpenseItem = items;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
        function queryExpensePayDepts() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetExpenditureDepartment).then(function (depts) {
                _refer.ExpensePayDept = depts;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
        function queryExpensePayBys() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetExpenditurePerson).then(function (persons) {
                _refer.ExpensePayBy = persons;
                defer.resolve();
            }, function () {
                defer.resolve();
            });

            return defer.promise;
        }
    }
]);