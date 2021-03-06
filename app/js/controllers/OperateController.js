angular.module('ExpAccount.controllers')

.controller('OperateController', ['$scope', '$ionicHistory', '$ionicScrollDelegate', 'AccountService', 'LgSelect', 'TextInput', 'Numberpad', 'ReferService', 'User',
    function($scope, $ionicHistory, $ionicScrollDelegate, AccountService, LgSelect, TextInput, Numberpad, ReferService, User) {
        $scope.data = {};

        $scope.data.DocumentType = ReferService.get('DocumentType');

        var now = new Date(),
            minDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()),
            maxDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

        $scope.datePick = {
            theme: 'ios',
            lang: 'zh',
            display: 'bottom',
            min: minDate,
            max: maxDate
        };

        $scope.selectSetting = {
            theme: 'ios',
            lang: 'zh',
            display: 'bottom',
            dataValue: 'ID',
            dataText: 'Name'
        };

        $scope.numPad = {
            theme: 'ios',
            lang: 'zh',
            decimalSeparator: '.',
            thousandsSeparator: '',
            display: 'bottom',
            min: 0.01,
            max: 99999999999.99,
            scale: 2,
            preset: 'decimal',
            onSet: function () {
                updateSumReimburseMoney();
                $scope.$apply();
            }
        };

        angular.forEach([
            { key: 'ReimburseUser', refer: 'ExpenditurePerson', name: '报销人' },
            { key: 'Department', refer: 'ExpenditureDepartment', name: '报销部门' },
            { key: 'Project', refer: 'Project', name: '项目' },
            { key: 'BondCustomer', refer: 'BondCustomer', name: '保证金客户' },
            { key: 'CostProject', refer: 'CostProject', name: '费用项目' },
            { key: 'Person', refer: 'ExpenditurePerson', name: '列支人员' }
        ], function (fn) {
            $scope['select' + fn.key] = function (tag) {
                LgSelect.show({
                    title: fn.name,
                    list: ReferService.get(fn.refer),
                    displayField: 'Name'
                }).then(function (item) {
                    tag[fn.key] = item;
                });
            };
        });

        $scope.selectExpenditureDepartment = function (tag) {
            LgSelect.show({
                title: '列支部门',
                list: ReferService.get('ExpenditureDepartment'),
                displayField: 'Name'
            }).then(function (item) {
                tag.Department = item;
            });
        };

        angular.forEach([
            { key: 'Use', name: '用途' },
            { key: 'Reason', name: '事由' }
        ], function (fn) {
            $scope['input' + fn.key] = function (tag) {
                TextInput.show({
                    title: fn.name,
                    text: tag.Remark
                }).then(function (text) {
                    tag.Remark = text;
                });
            };
        });

        $scope.selectMoney = function (exp) {
            Numberpad.show({
                value: exp.Money,
                decimal: true
            }).then(function (number) {
                exp.Money = number;
            });
        };

        $scope.saveAccount = function () {
            if (!$scope.data.doc.ReimburseBillDetails || $scope.data.doc.ReimburseBillDetails.length === 0) {
                u9.alert('请添加费用明细', '必填项');
                return;
            }
            var len = $scope.data.doc.ReimburseBillDetails.length;
            for (var i = 0; i < len; i++) {
                if (!$scope.data.doc.ReimburseBillDetails[i].Money) {
                    break;
                }
            }
            if (i < len) {
                u9.alert('请输入费用明细' + (i + 1) + '的发票金额', '必填项');
                return;
            }
            u9.showLoading();
            var tmp = angular.copy($scope.data.doc);
            if (tmp.Project === 0) {
                delete tmp.Project;
            }
            angular.forEach(tmp.ReimburseBillDetails, function (detail) {
                delete detail.isExpanded;
                if (detail.Project === 0) {
                    delete detail.Project;
                }
            });
            AccountService.saveDoc(tmp).then(function () {
                $ionicHistory.goBack();
            }, function (err) {
                u9.alert(err.Message || '处理报销单失败', '操作失败');
            }).finally(function () {
                u9.hideLoading();
            });
        };

        $scope.addExpence = function () {
            if (!$scope.data.doc.ReimburseBillDetails) {
                $scope.data.doc.ReimburseBillDetails = [];
            }
            var tmp = { isExpanded: true };
            var costProject = ReferService.get('CostProject');
            if (angular.isArray(costProject) && costProject.length > 0) {
                tmp.CostProject = costProject[0];
            }
            tmp.Project = $scope.data.doc.Project;
            tmp.Person = $scope.data.doc.ReimburseUser;
            tmp.Department = $scope.data.doc.Department;
            $scope.data.doc.ReimburseBillDetails.push(tmp);
            $ionicScrollDelegate.$getByHandle('operateScroll').scrollBottom(true);
        };
        $scope.deleteExpence = function (index, event) {
            $scope.data.doc.ReimburseBillDetails.splice(index, 1);
            updateSumReimburseMoney();
            resizeScroll();
            event.stopPropagation();
        };

        $scope.$on('vAccordion:onExpandAnimationEnd', resizeScroll);
        $scope.$on('vAccordion:onCollapseAnimationEnd', resizeScroll);

        init();

        function updateSumReimburseMoney() {
            var sumReimburseMoney = 0;
            angular.forEach($scope.data.doc.ReimburseBillDetails, function (exp) {
                sumReimburseMoney += exp.Money;
            });
            $scope.data.doc.Money = sumReimburseMoney;
        }

        function init() {
            var operateInfo = AccountService.getOperateDoc();
            $scope.data.title = operateInfo.operate === 0 ? '新增' : operateInfo.doc.DocNo;
            $scope.data.doc = operateInfo.doc;

            if (operateInfo.operate !== 0) {
                return;
            }
            $scope.data.doc.ReimburseUser = {
                ID: User.get('UserID'),
                Name: User.get('UserName')
            };
            $scope.data.doc.Department = {
                ID: User.get('DeptID'),
                Name: User.get('DeptName')
            };
            $scope.data.doc.ReimburseDate = new Date();

            if (angular.isArray($scope.data.DocumentType) && $scope.data.DocumentType.length > 0) {
                $scope.data.doc.DocumentType = $scope.data.DocumentType[0].ID;
            }
        }

        function resizeScroll() {
            $ionicScrollDelegate.$getByHandle('operateScroll').resize();
        }
    }
]);
