angular.module('ExpAccount.services')

.factory('AccountService', ['$q', '$filter', 'U9Service', 'User', 'APPCONSTANTS',
    function($q, $filter, U9Service, User, APPCONSTANTS) {
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

            doc.ReimburseUser = doc.ReimburseUser.ID;
            doc.Department = doc.Department.ID;
            if (doc.Project) {
                doc.Project = doc.Project.ID;
            }
            if (doc.BondCustomer) {
                doc.BondCustomer = doc.BondCustomer.ID;
            }
            doc.ReimburseDate = toJavaTime(doc.ReimburseDate);

            angular.forEach(doc.ReimburseBillDetails, function (detail) {
                detail.CostProject = detail.CostProject.ID;
                detail.Department = detail.Department.ID;
                detail.Person = detail.Person.ID;
                if (detail.Project) {
                    detail.Project = detail.Project.ID;
                }
                if (_operate === 1) {
                    detail.RowProcessStatus = 1;
                }
            });

            var operateName = APPCONSTANTS.CreateReimburseBill;
            if (_operate === 1) {
                operateName = APPCONSTANTS.UpdateReimburseBill;
            }

            if (!doc.BondCustomer) {
                delete doc.BondCustomer;
            }

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

            U9Service.post(APPCONSTANTS.DeleteReimburseBill, { iD: docId }).then(function(success) {
                if (success) {
                    return getReimburseBillList();
                } else {
                    return $q.reject();
                }
            }).then(function() {
                defer.resolve();
            }).catch(function(err) {
                defer.reject(err);
            });

            return defer.promise;
        };
        o.submitDoc = function(docId) {
            var defer = $q.defer();

            U9Service.post(APPCONSTANTS.SubmitReimburseBill, { iD: docId }).then(function(success) {
                if (success) {
                    return getReimburseBillList();
                } else {
                    return $q.reject();
                }
            }).then(function() {
                defer.resolve();
            }).catch(function(err) {
                defer.reject(err);
            });

            return defer.promise;
        };
        o.getAccountDetail = function(docId) {
            var defer = $q.defer();


            U9Service.post(APPCONSTANTS.GetReimburseBill, { iD: docId }).then(function (doc) {
                delete doc.__type;
                angular.forEach(doc.ReimburseBillDetails, function (detail) {
                    detail.isExpanded = true;
                    delete detail.ReimburseBillQueryInfoDto;
                    delete detail.__type;
                });
                defer.resolve(doc);
            }, function(err) {
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
                    doc.DocumentType = doc.DocumentType.ID;
                    doc.ReimburseDate = toJsTime(doc.ReimburseDate);

                    delete doc.__type;
                });
                _docs = $filter('orderBy')(docs, ['ReimburseDate', 'DocNo'], true);
                defer.resolve();
            }, function() {
                defer.resolve();
            });

            return defer.promise;
        }

        function toJsTime(date) {
            return new Date(parseInt(date.replace(/\/Date\((\d+[\+\-]\d+)\)\//g, '$1')));
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
