
angular.module('ExpAccount.utility')

.factory('SelectModel', ['$q', '$rootScope', '$filter', '$timeout', '$ionicModal',
    function($q, $rootScope, $filter, $timeout, $ionicModal) {

	    return {
	        show: showModel
	    };

	    function showModel(opts) {
	    	var defer = $q.defer();

	    	// u9.showLoading();

	    	var scope = $rootScope.$new(true),
	    	    list = opts.list ? opts.list : [];
	    	scope.data = {};
	    	scope.data.title = opts.title ? opts.title : '';
	    	scope.data.list = list;
	    	scope.data.displayField = opts.displayField ? opts.displayField : 'name';
	    	scope.data.value = opts.value ? opts.value : '';

	    	scope.data.search = '';

	    	var searchBy = opts.searchBy ? opts.searchBy : scope.data.displayField;
	    	var templateString = 
	    	'<ion-modal-view class="select-model">' +
	    		'<ion-header-bar>' +
	    			'<button class="button button-clear " ng-click="onCancel()">取消</button>' +
	    	     	'<h1 class="title">{{data.title}}</h1>' +
	    	    '</ion-header-bar>' +
	    	    '<ion-header-bar class="bar-subheader">' +
	    	    	'<form class="search-input-form" ng-submit="onSearch()">' +
		    	        '<label class="item-input-wrapper search-item-input">' +
			    	        '<i class="icon ion-ios-search-strong placeholder-icon"></i>' +
			    	        '<input type="search" placeholder="搜索" ng-model="data.search">' +
			    	        '<i class="icon ion-ios-close" ng-if="data.search" on-tap="clearSearch()"></i>' +
		    	        '</label>' +
	    	        '</form>' +
	    	    '</ion-header-bar>' +
	    	    '<ion-content>' +
	    	        '<ion-item class="select-item" collection-repeat="item in data.list"' +
	    	           'ng-click="onClick(item)">{{item[data.displayField]}}</ion-item>' +
	    	    '</ion-content>' +
	    	'</ion-modal-view>';

	    	var modal = $ionicModal.fromTemplate(templateString, {
	    	    scope: scope
	    	});
	    	scope.onCancel = function () {
	    		modal.hide();
	    		defer.reject();
	    	};
	    	scope.onClick = function (item) {
	    	    modal.hide();
	    	    defer.resolve(item);
	    	};
	    	scope.clearSearch = function () {
	    		scope.data.search = '';
	    		scope.data.list = list;
	    	};
	    	scope.onSearch = function () {
	    		if (window.parent) {
	    			parent.ionic.keyboard.hide();;
	    		} else {
	    			ionic.keyboard.hide();
	    		}
	    	    scope.data.list = $filter('filter')(list, function (item) {
	    	        if (item[searchBy].indexOf(scope.data.search) !== -1) {
	    	            return true;
	    	        }
	    	    });
	    	};
	    	scope.$on('modal.hidden', function () {
	    	    $timeout(function() {
	    	        modal.scope.$destroy();
	    	        modal.$el.remove();
	    	    }, modal.hideDelay || 320);
	    	});

	    	// u9.hideLoading();

	    	modal.show();

	    	return defer.promise;
	    }
    }
]);