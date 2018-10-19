(function () {

    'use strict';

    angular
    .module('app')
    .controller('SigninController', SigninController);

    SigninController.$inject = ['$scope', '$http', '$window', '$location', '$state', '$rootScope', 'API', 'ENUM','ConfigModel'];

    function SigninController($scope, $http, $window, $location, $state, $rootScope, API, ENUM,ConfigModel) {

    	$scope.username = "";
    	$scope.password = "";
    	$scope.canSubmit = false;
    	$scope.touchSignin = _touchSignin;
    	$scope.touchSignup = _touchSignup;
    	$scope.touchForget = _touchForget;
    	$scope.touchWeixin = _touchWeixin;
        $scope.touchQQ    = _touchQQ;
//        $scope.isWeixin    = _isWeixin;

        
        $scope.validInput = function(){
            if ( $scope.username.length > 3 && $scope.password.length > 4) {
            	$scope.canSubmit = true;
            }else{
            	$scope.canSubmit = false;
            }
        };
    	function _touchSignin() {
    		var username = $scope.username;
    		var password = $scope.password;

            if ( !username || username.length < 3 ) {
                $scope.toast('用户名太短');
                return;
            }

            if ( !username || username.length > 25 ) {
                $scope.toast('用户名太长');
                return;
            }

            if ( !password || password.length < 4 ) {
                $scope.toast('请输入正确的密码');
                return;
            }

		    var sendData={
	            "data": {
	            	"userName":$scope.username,
	            	"password":$scope.password
	            }
	        };
		    $.ajax({
		        type: "post",
		        url: "/user/uLogin/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success : function(data){ 
		        	console.log(data);
		          if(data.errorInfo==null){
		        	  console.log(data);
		        	  history.back();
		          }else{
		        	  $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
    	}

    	function _touchSignup() {
            $state.go('signup', {});
    	}

    	function _touchForget() {
            $state.go('forget', {});
    	}

    	function _touchWeixin() {
			$state.go('wechat-auth', {});
    	}

        function _touchQQ() {
            $state.go('qq-auth', {});
        }

//        function _isWeixin() {
//
//            var config = ConfigModel.getConfig();
//            var wechat = config['wechat.web'];
//            return wechat && $rootScope.isWeixin();
//        }
    }

})();
