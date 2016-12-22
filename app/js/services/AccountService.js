angular.module('ExpAccount.services')

.factory('AccountService', ['$q', '$timeout', function($q, $timeout) {
    var o = {};

    var _operate; // 0: 新增; 1: 修改
    var _operateDoc; 
    
    o.setOperateDoc = function (operate, doc) {
    	_operate = operate;
    	_operateDoc = doc ? angular.copy(doc) : {};
    };
    o.getOperateDoc = function () {
    	return {
    		operate: _operate,
    		doc: _operateDoc
    	};
    };
    o.getAccounts = function () {
    	var defer = $q.defer();

    	$timeout(function () {
    		defer.resolve(createTestAccounts());
    	}, 500);

    	return defer.promise;
    };

    return o;

    function createTestAccounts() {
    	var r = [];
    	for (var i = 201; i <= 250; i++) {
    		r.push({ DocNo: 'MO2016122' + i });
    	}
    	return r;
    }
}]);