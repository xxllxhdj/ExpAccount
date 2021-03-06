
angular.module('ExpAccount.utility')

.factory('Numberpad', ['$q', '$rootScope', '$ionicModal', '$timeout', function ($q, $rootScope, $ionicModal, $timeout) {
    return {
        show: showNumberpad
    };

    function showNumberpad(opts) {
        var defer = $q.defer();

        var scope = $rootScope.$new(true);
        scope.value = opts.value ? opts.value.toString() : '';
        scope.decimal = !!opts.decimal;

        scope.keyss = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

        scope.disable = {
            submit: false,
            zero: false,
            point: false,
            backspace: false,
            number: false
        };

        updateDisable();

        function updateDisable() {
            scope.disable.backspace = scope.value.length === 0;
            scope.disable.number = /^0$/.test(scope.value);

            var tmp = (scope.value.length === 0) || /^0$/.test(scope.value) || /^0\.0*$/.test(scope.value);
            if (opts.minValue) {
                tmp = tmp || (parseFloat(scope.value) < opts.minValue);
            }
            if (opts.maxValue) {
                tmp = tmp || (parseFloat(scope.value) > opts.maxValue);
            }
            scope.disable.submit = tmp;

            scope.disable.zero = (!scope.decimal && (scope.value.length === 0)) || /^0$/.test(scope.value);
            scope.disable.point = !scope.decimal || (scope.value.length === 0) || (scope.value.indexOf('.') !== -1);
        }

        scope.onKey = function (key) {
            scope.value += key;
            updateDisable();
        };
        scope.onClear = function () {
            scope.value = '';
            updateDisable();
        };
        scope.onBackspace = function () {
            scope.value = scope.value.substr(0, scope.value.length - 1);
            updateDisable();
        };

        var templateString =
        '<div class="numberpad">' +
            '<div class="numberpad-hd">' +
                '<button class="button button-clear" ng-click="onCancel()">取消</button>' +
                '<button class="button button-clear" ng-disabled="disable.submit" ng-click="onSubmit()">确认</button>' +
            '</div>' +
            '<div class="item item-icon-right numberpad-dp">' +
                '<i class="icon ion-backspace-outline" ng-disabled="disable.backspace" ng-click="onBackspace()"></i>' +
                '{{value}}' +
            '</div>' +
            '<div class="numberpad-bd">' +
                '<div class="row" ng-repeat="keys in keyss">' +
                    '<div class="col button" ng-repeat="key in keys" ng-disabled="disable.number" ng-click="onKey(key)">{{key}}</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col button" ng-disabled="disable.point" ng-click="onKey(\'.\')">&bull;</div>' +
                    '<div class="col button" ng-disabled="disable.zero" ng-click="onKey(\'0\')">0</div>' +
                    '<div class="col button" ng-click="onClear()">清空</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        var modal = $ionicModal.fromTemplate(templateString, {
            viewType: 'numberpad',
            animation: 'slide-in-up',
            scope: scope
        });

        var hasSubmit = false;
        scope.onCancel = function () {
            modal.hide();
        };
        scope.onSubmit = function () {
            hasSubmit = true;
            modal.hide();
        };

        scope.$on('numberpad.hidden', function () {
            if (hasSubmit) {
                defer.resolve(parseFloat(scope.value));
            } else {
                defer.reject();
            }
            $timeout(function() {
                modal.scope.$destroy();
                modal.$el.remove();
            }, modal.hideDelay || 320);
        });

        modal.show();

        return defer.promise;
    }
}]);
