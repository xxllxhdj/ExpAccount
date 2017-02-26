angular.module('ExpAccount.controllers')

.controller('LgSelectController', ['$scope', '$ionicHistory', '$filter', 'LgSelect',
    function($scope, $ionicHistory, $filter, LgSelect) {
        var _opts = LgSelect.getOpts(),
            _select = false;

        $scope.data = {
            title: _opts.title,
            list: _opts.list,
            displayField: _opts.displayField,
            search: ''
        };

        $scope.$on('$ionicView.beforeLeave', function () {
            if (!_select) {
                _opts.defer.reject();
            }
        });

        $scope.onClick = function (item) {
            _opts.defer.resolve(item);
            _select = true;
            $ionicHistory.goBack();
        };
        $scope.clearSearch = function () {
            $scope.data.search = '';
            $scope.data.list = _opts.list;
        };
        $scope.onSearch = function () {
            if (window.parent) {
                parent.ionic.keyboard.hide();
            } else {
                ionic.keyboard.hide();
            }
            $scope.data.list = $filter('filter')(_opts.list, function (item) {
                if (item[$scope.data.displayField].indexOf($scope.data.search) !== -1) {
                    return true;
                }
            });
        };
    }
]);
