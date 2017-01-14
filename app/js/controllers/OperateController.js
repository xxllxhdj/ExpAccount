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
            dataValue: 'Code',
            dataText: 'Name'
        };

        $scope.saveAccount = function () {
            if (!$scope.data.doc.Expences) {
                u9.alert('请添加费用明细', '必填项');
                return;
            }
            var len = $scope.data.doc.Expences.length;
            for (var i = 0; i < len; i++) {
                if (!$scope.data.doc.Expences[i].InvoiceMoney) {
                    break;
                }
            }
            if (i < len) {
                u9.alert('请输入费用明细' + (i + 1) + '的发票金额', '必填项');
                return;
            }
            u9.showLoading();
            AccountService.saveDoc($scope.data.doc).then(function () {
                $ionicHistory.goBack();
            }).finally(function () {
                u9.hideLoading();
            });
        };

        $scope.addExpence = function () {
            if (!$scope.data.doc.Expences) {
                $scope.data.doc.Expences = [];
            }
            $scope.data.doc.Expences.push({
                isExpanded: true
            });
            $ionicScrollDelegate.$getByHandle('operateScroll').scrollBottom(true);
        };
        $scope.deleteExpence = function (index, event) {
            $scope.data.doc.Expences.splice(index, 1);
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
            angular.forEach($scope.data.doc.Expences, function (exp) {
                sumReimburseMoney += exp.Money;
            });
            $scope.data.doc.Money = sumReimburseMoney;
        }

        function init() {
            var operateInfo = AccountService.getOperateDoc();
            $scope.data.title = operateInfo.operate === 0 ? '新增' : operateInfo.doc.DocNo;
            $scope.data.doc = operateInfo.doc;
        }

        function resizeScroll() {
            $ionicScrollDelegate.$getByHandle('operateScroll').resize();
        }
    }
]);
