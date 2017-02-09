angular.module('ExpAccount.controllers')

.controller('OperateController', ['$scope', '$ionicHistory', '$ionicScrollDelegate', 'AccountService', 'ReferService',
    function($scope, $ionicHistory, $ionicScrollDelegate, AccountService, ReferService) {
        $scope.data = {};

        $scope.data.DocumentTypes = ReferService.get('DocumentType');
        $scope.data.ExpensePayProjects = ReferService.get('ExpensePayProject');
        $scope.data.MarginClients = ReferService.get('MarginClient');
        $scope.data.ExpenseItems = ReferService.get('ExpenseItem');
        $scope.data.ExpensePayDepts = ReferService.get('ExpensePayDept');
        $scope.data.ExpensePayBys = ReferService.get('ExpensePayBy');

        $scope.data.selectSetting = {
            theme: 'ios',
            lang: 'zh',
            display: 'bottom',
            dataValue: 'ID',
            dataText: 'Name'
        };

        $scope.saveAccount = function () {
            if (!$scope.data.doc.ReimburseBillDetails) {
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
            angular.forEach(tmp.ReimburseBillDetails, function (detail) {
                delete detail.isExpanded;
            });
            AccountService.saveDoc(tmp).then(function () {
                $ionicHistory.goBack();
            }).finally(function () {
                u9.hideLoading();
            });
        };

        $scope.addExpence = function () {
            if (!$scope.data.doc.ReimburseBillDetails) {
                $scope.data.doc.ReimburseBillDetails = [];
            }
            var tmp = { isExpanded: true };
            if (angular.isArray($scope.data.ExpenseItems) && $scope.data.ExpenseItems.length > 0) {
                tmp.CostProject = $scope.data.ExpenseItems[0].ID;
            }
            tmp.Project = $scope.data.doc.Project;
            $scope.data.doc.ReimburseBillDetails.push(tmp);
            $ionicScrollDelegate.$getByHandle('operateScroll').scrollBottom(true);
        };
        $scope.deleteExpence = function (index, event) {
            $scope.data.doc.ReimburseBillDetails.splice(index, 1);
            updateSumReimburseMoney();
            resizeScroll();
            event.stopPropagation();
        };
        $scope.onKeyUp = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode === 110) {
                return;
            }
            updateSumReimburseMoney();
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
            $scope.data.doc.Money = 0;
            $scope.data.doc.ReimburseDate = new Date();
            if (angular.isArray($scope.data.DocumentTypes) && $scope.data.DocumentTypes.length > 0) {
                $scope.data.doc.DocumentType = $scope.data.DocumentTypes[0].ID;
            }
            if (angular.isArray($scope.data.ExpensePayProjects) && $scope.data.ExpensePayProjects.length > 0) {
                $scope.data.doc.Project = $scope.data.ExpensePayProjects[0].ID;
            }
            if (angular.isArray($scope.data.MarginClients) && $scope.data.MarginClients.length > 0) {
                $scope.data.doc.BondCustomer = $scope.data.MarginClients[0].ID;
            }
        }

        function resizeScroll() {
            $ionicScrollDelegate.$getByHandle('operateScroll').resize();
        }
    }
]);
