angular.module('ExpAccount.controllers')

.controller('HomeController', ['$scope', '$state', 'AccountService', function($scope, $state, AccountService) {
    $scope.data = {
        docs: []
    };

    $scope.addDoc = function () {
        AccountService.setOperateDoc(0, {});
        $state.go('operate');
    };
    $scope.editDoc = function (doc) {
        u9.showLoading();
        AccountService.getAccountDetail(doc.ID).then(function (dc) {
            u9.hideLoading();
            doc.ReimburseBillDetails = dc.ReimburseBillDetails;
            AccountService.setOperateDoc(1, doc);
            $state.go('operate');
        }, function (err) {
            u9.hideLoading();
            u9.alert(err.Message || '获取报销单明细失败');
        });
    };
    $scope.submitDoc = function (doc) {
        u9.showLoading();
        AccountService.submitDoc(doc.ID).then(function () {
            init();
            u9.hideLoading();
        }, function (err) {
            u9.hideLoading();
            u9.alert(err.Message || '提交失败', '提交报销单');
        });
    };
    $scope.deleteDoc = function (doc) {
        u9.showLoading();
        AccountService.deleteDoc(doc.ID).then(function () {
            init();
            u9.hideLoading();
        }, function (err) {
            u9.hideLoading();
            u9.alert(err.Message || '删除失败', '删除报销单');
        });
    };

    $scope.$on('$ionicView.afterEnter', init);

    function init () {
        $scope.data.docs = AccountService.getAccounts();
    }
}]);
