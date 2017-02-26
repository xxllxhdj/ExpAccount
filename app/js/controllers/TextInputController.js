angular.module('ExpAccount.controllers')

.controller('TextInputController', ['$scope', '$ionicHistory', 'TextInput',
    function($scope, $ionicHistory, TextInput) {
        var _opts = TextInput.getOpts(),
            _hasInput = false;

        $scope.data = {
            title: _opts.title,
            text: _opts.text
        };

        $scope.$on('$ionicView.beforeLeave', function () {
            if (!_hasInput) {
                _opts.defer.reject();
            }
        });

        $scope.onClick = function () {
            _opts.defer.resolve($scope.data.text);
            _hasInput = true;
            $ionicHistory.goBack();
        };
    }
]);
