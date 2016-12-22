angular.module('ExpAccount.controllers')

.controller('HomeController', ['$scope', '$state', 'AccountService', function($scope, $state, AccountService) {
    $scope.data = {
        docs: []
    };

    $scope.addDoc = function () {
        AccountService.setOperateDoc(0);
        $state.go('operate');
    };
    $scope.editDoc = function (doc) {
        AccountService.setOperateDoc(1, doc);
        $state.go('operate');
    };
    $scope.deleteDoc = function (index) {
        $scope.data.docs.splice(index, 1);
    };

    init();

    function init () {
        AccountService.getAccounts().then(function (docs) {
            $scope.data.docs = docs;
        }).finally(function () {
            u9.hideLoading();
        });
    }
    // $scope.datePick = {
    //     theme: 'ios',
    //     lang: 'zh',
    //     display: 'bottom'
    // };
    // $scope.testDate = '';
    // $scope.select = {
    //     theme: 'ios',
    //     lang: 'zh',
    //     display: 'bottom'
    // };
    // $scope.selectDate = [
    //     { text: '测试1', value: 'test1' },
    //     { text: '测试2', value: 'test2' },
    //     { text: '测试3', value: 'test3' },
    //     { text: '测试4', value: 'test4' },
    //     { text: '测试5', value: 'test5' },
    //     { text: '测试6', value: 'test6' },
    //     { text: '测试7', value: 'test7' },
    //     { text: '测试8', value: 'test8' },
    //     { text: '测试9', value: 'test9' },
    //     { text: '测试10', value: 'test10' }
    // ];
    // $scope.testSelect = '';
}]);
