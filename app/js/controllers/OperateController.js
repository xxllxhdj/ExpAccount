angular.module('ExpAccount.controllers')

.controller('OperateController', ['$scope', '$ionicScrollDelegate', 'AccountService', 'ReferService',
    function($scope, $ionicScrollDelegate, AccountService, ReferService) {
        $scope.data = {};

        $scope.data.DocumentTypes = ReferService.get('DocumentType');
        $scope.data.ExpensePayProjects = ReferService.get('ExpensePayProject');
        $scope.data.MarginClients = ReferService.get('MarginClient');

        $scope.data.selectSetting = {
            theme: 'ios',
            lang: 'zh',
            display: 'bottom',
            dataValue: 'Code',
            dataText: 'Name'
        };
        // $scope.data.rdSetting = {
        //     theme: 'ios',
        //     lang: 'zh',
        //     display: 'bottom',
        //     min: new Date(new Date().getFullYear() - 20, 1, 1),
        //     max: new Date(new Date().getFullYear() + 20, 1, 1) 
        // };

        $scope.$on('vAccordion:onExpandAnimationEnd', resizeScroll);
        $scope.$on('vAccordion:onCollapseAnimationEnd', resizeScroll);

        init();

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
