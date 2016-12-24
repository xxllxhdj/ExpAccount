angular.module('ExpAccount.services')

.factory('AccountService', ['$q', '$timeout', function($q, $timeout) {
    var o = {};

    var _operate; // 0: 新增; 1: 修改
    var _operateDoc; 

    var _docs = [];
    
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
    o.saveDoc = function (doc) {
        var defer = $q.defer();

        $timeout(function () {
            var len = _docs.length;
            if (_operate === 0) {
                doc.DocNo = 'MO2016122' + (201 + len);
                _docs.push(doc);
                defer.resolve();
                return;
            }
            for (var i = len - 1; i >= 0; i--) {
                if (_docs[i].DocNo === doc.DocNo) {
                    break;
                }
            }
            angular.merge(_docs[i], doc);
            defer.resolve();
        }, 200);

        return defer.promise;
    };
    o.getAccounts = function () {
    	return _docs;
    };

    return o;
}]);