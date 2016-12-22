
angular.module('ExpAccount', [
    'ionic',
    'mobiscroll-datetime',
    'mobiscroll-select',
    'vAccordion',

    'ExpAccount.controllers',
    'ExpAccount.directives',
    'ExpAccount.services',
    'ExpAccount.utility'
])

// .run(['$ionicPlatform', 'InitService', function ($ionicPlatform, InitService) {
//     $ionicPlatform.ready(function () {
//         InitService.then(function () {
//             u9.hideLoading();
//         });
//     });
// }])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
    function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'tpls/home.html',
                controller: 'HomeController'
            })
            .state('operate', {
                url: '/operate',
                templateUrl: 'tpls/operate.html',
                controller: 'OperateController'
            });
        $urlRouterProvider.otherwise('/home');

        $ionicConfigProvider.platform.android.scrolling.jsScrolling(true);
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.backButton.previousTitleText(false);
        $ionicConfigProvider.platform.android.navBar.transition('view');
        $ionicConfigProvider.platform.android.views.transition('ios');
        $ionicConfigProvider.platform.android.views.swipeBackEnabled(true);
        $ionicConfigProvider.platform.android.views.swipeBackHitWidth(45);
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.android.form.toggle('large');

        $ionicConfigProvider.platform.default.backButton.previousTitleText(false);
        $ionicConfigProvider.platform.default.backButton.text(false);
    }
]);

(function () {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ExpAccount']);
    });
})();
