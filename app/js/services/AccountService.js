angular.module('ExpAccount.services')

.factory('AccountService', ['$q', 'U9Service', 'User', 'APPCONSTANTS',
    function($q, U9Service, User, APPCONSTANTS) {
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

            doc.ReimburseDate = toJavaTime(doc.ReimburseDate);

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

        User.init.finally(function () {
            getReimburseBillList().finally(function() {
                _defer.resolve();
            });
        });

        return o;

        function getReimburseBillList() {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.GetReimburseBillList, {
                userID: User.get('UserID') || -1
            }).then(function(docs) {
                angular.forEach(docs, function (doc) {
                    doc.ReimburseDate = toJsTime(doc.ReimburseDate);
                });
                _docs = docs;
                defer.resolve();
            }, function() {
                defer.resolve();
            });

            return defer.promise;
        }

        function toJsTime(date) {
            return new Date(parseInt(date.replace(/\/Date\((\d+\+\d+)\)\//g, '$1')));
        }

        function toJavaTime(date) {
            var timeZone = date.getTimezoneOffset() / 60,
                tz = '';
            if (timeZone < 0) {
                tz += '+';
                timeZone = -1 * timeZone;
            } else {
                tz += '-';
            }
            if (timeZone < 10) {
                tz += '0';
            }
            tz += timeZone;
            return '\/Date(' + date.valueOf() + tz + '00)\/';
        }
    }
]);
