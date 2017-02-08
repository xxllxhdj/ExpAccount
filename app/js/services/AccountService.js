angular.module('ExpAccount.services')

.factory('AccountService', ['$q', 'U9Service', 'APPCONSTANTS', function($q, U9Service, APPCONSTANTS) {
    var _defer = $q.defer();

    var o = {
        init: _defer.promise
    };

    var _operate; // 0: 新增; 1: 修改
    var _operateDoc;

    var _docs = [];

    o.setOperateDoc = function(operate, doc) {
        _operate = operate;
        _operateDoc = doc ? angular.copy(doc) : {};
    };
    o.getOperateDoc = function() {
        return {
            operate: _operate,
            doc: _operateDoc
        };
    };
    o.saveDoc = function(doc) {
        var defer = $q.defer();

        var operateName = (_operate === 0) ? APPCONSTANTS.CreateReimburseBill : APPCONSTANTS.UpdateReimburseBill;

        U9Service.post(operateName, { reimburseBillInfo: doc }).then(function() {
            return getReimburseBillList();
        }).then(function() {
            defer.resolve();
        }).catch(function(err) {
            defer.reject(err);
        });

        return defer.promise;
    };
    o.deleteDoc = function(docId) {
        var defer = $q.defer();

        U9Service.post(APPCONSTANTS.DeleteReimburseBill, { ID: docId }).then(function() {
            return getReimburseBillList();
        }).then(function() {
            defer.resolve();
        }).catch(function(err) {
            defer.reject(err);
        });

        return defer.promise;
    };
    o.getAccounts = function() {
        return _docs;
    };

    getReimburseBillList().finally(function() {
        _defer.resolve();
    });

    return o;

    function getReimburseBillList() {
        var defer = $q.defer();

        U9Service.post(APPCONSTANTS.GetReimburseBillList, {
            userID: 1001609190006015
        }).then(function(docs) {
            _docs = docs;
            defer.resolve();
        }, function() {
            defer.resolve();
        });

        return defer.promise;
    }
}]);
