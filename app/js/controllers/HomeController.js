angular.module('ExpAccount.controllers')

.controller('HomeController', ['$scope', '$state', 'AccountService', function($scope, $state, AccountService) {
    $scope.data = {
        docs: []
    };

    $scope.addDoc = function () {
        AccountService.setOperateDoc(0, { ReimburseDate: new Date() });
        $state.go('operate');
    };
    $scope.editDoc = function (doc) {
        AccountService.setOperateDoc(1, doc);
        $state.go('operate');
    };
    $scope.deleteDoc = function (index) {
        $scope.data.docs.splice(index, 1);
    };

    $scope.$on('$ionicView.afterEnter', init);

    function init () {
        $scope.data.docs = AccountService.getAccounts();
    }
}]);
