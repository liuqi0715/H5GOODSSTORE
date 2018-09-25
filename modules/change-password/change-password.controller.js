(function () {

	'use strict';

	angular
		.module('app')
		.controller('ChangePasswordController', ChangePasswordController);

	ChangePasswordController.$inject = ['$scope', '$http', '$window', '$location', '$state', 'API', 'ENUM'];

	function ChangePasswordController($scope, $http, $window, $location, $state, API, ENUM) {

		$scope.oldPassword = "";
		$scope.newPassword = "";

		$scope.touchChangePassword = touchChangePassword;

		function touchChangePassword() {

			var oldPassword = $scope.oldPassword;
			var newPassword = $scope.newPassword;
			var newPassword2 = $scope.newPassword2;

			if (newPassword != newPassword2) {
				$scope.toast("两次密码输入不一致");
				return;
			}

			var sendData={
				"data":{
					"oldPassword":oldPassword,
					"newPassword":newPassword
				}
			};

		    $.ajax({
		        type: "post",
		        async:false,
		        url: "/user/changePassword/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success : function(data){ 
		          if(data.errorInfo==null){
                     $scope.toast(data.success.successMsg);
                     $state.go('profile', {});
		          }else{
		        	  $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
		}
	}

})();