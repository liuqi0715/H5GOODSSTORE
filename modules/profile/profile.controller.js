(function () {

	'use strict';

	angular
		.module('app')
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['$scope', '$http', '$rootScope', '$location', '$state', 'API', 'AppAuthenticationService', 'CartModel', 'ConfigModel'];

	function ProfileController($scope, $http, $rootScope, $location, $state, API, AppAuthenticationService, CartModel, ConfigModel) {
	console.log("hahauyfer");
		$scope.touchAllOrders 		= _touchAllOrders;
		$scope.touchOrderCreated 	= _touchOrderCreated;
		$scope.touchOrderPayed 		= _touchOrderPayed;
		$scope.touchOrderDelivering = _touchOrderDelivering;
		$scope.touchOrderDelivered 	= _touchOrderDelivered;
		
		$scope.touchFav 		= _touchFav;
		$scope.touchAddress 	= _touchAddress;
		$scope.touchScore 		= _touchScore;
		$scope.touchCashGift 	= _touchCashGift;
		$scope.touchHelps 		= _touchHelps;
		$scope.touchPassword 	= _touchPassword;
		$scope.touchSignin 		= _touchSignin;
		$scope.touchSignout 	= _touchSignout;
		$scope.touchBonus 		= _touchBonus;
		$scope.touchBalance 	= _touchBalance;
		$scope.isSignIn 		= _isSignIn;

//		$scope.isWeixin  = _isWeixin;

		$scope.cartModel = CartModel;

		$scope.user = AppAuthenticationService.getUser();
		$scope.userName = "";

//		ConfigModel.fetch();
//
//		var config = ConfigModel.getConfig();
//		$scope.authorize = config.authorize;

		function _touchAllOrders() {
			$state.go('my-order', {
				tab: 'all'
			});
		}

		function _touchOrderCreated() {
			console.log("什么情况啊++++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('my-order', {
                    tab: 'created'
                })
            }

		/*	$state.go('my-order', {
				tab: 'created'
			});*/
		}

		function _touchOrderPayed() {
			console.log("代发货需要先登录++++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('my-order', {
                    tab: 'paid'
                });
            }
		/*	$state.go('my-order', {
				tab: 'paid'
			});*/
		}

		function _touchOrderDelivering() {
            console.log("想看Fa需要先登录+++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('my-order', {
                    tab: 'delivering'
                });
            }
		/*
			$state.go('my-order', {
				tab: 'delivering'
			});*/
		}

		function _touchOrderDelivered() {
            console.log("想已取消需要先登录+++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('my-order', {
                    tab: 'delivered'
                });
            }
			/*$state.go('my-order', {
				tab: 'delivered'
			});*/
		}

		function _touchFav() {
			console.log("想看Fa需要先登录+++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('my-favorite', {});
            }
			// $state.go('my-favorite', {});
		}

		function _touchAddress() {
			console.log("是否要驗證登錄")
			// $state.go('my-address', {});

                var user = AppAuthenticationService.getUser();
                if(user.state == false){
                    $scope.toast("请先登录")
                    $rootScope.goSignin();
                }else {
                    $state.go('my-address', {});
				}

		}

		function _touchScore() {
			$state.go('my-score', {
				tab: 'all'
			});
		}

		function _touchCashGift() {
			$state.go('my-cashgift', {});
		}

		function _touchHelps() {
			$state.go('article', {});
		}

		function _touchPassword() {
			console.log("修改密码先登录++")
            var user = AppAuthenticationService.getUser();
            if(user.state == false){
                $scope.toast("请先登录")
                $rootScope.goSignin();
            }else {
                $state.go('change-password', {});
            }
			// $state.go('change-password', {});
		}

		function _touchSignin() {
			console.log("登录+++++++++",$scope.userName)

			if (!AppAuthenticationService.getToken()&&$scope.userName==null) {
				$scope.goSignin();
			}
		}

		function _touchSignout() {
//			if (AppAuthenticationService.getToken()) {
//				API.auth.base
//					.signout()
//					.then(function (success) {
//						if (success) {
//							$scope.goHome();
//							$scope.toast('注销成功');
//						} else {
//							$scope.toast('注销失败');
//						}
//					});
//			}
		    var sendData={
	            "data": {}
	        };
		    $.ajax({
		        type: "post",
		        async:false,
		        url: "/user/uExit/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success : function(data){ 
		          if(data.errorInfo==null){
                      $scope.userName = null;
					  console.log($scope.userName,"清空用户名++++++++++++++++")
		        	  $scope.toast('已退出登录');
		        	  $scope.user = AppAuthenticationService.getUser();
		        	  _isSignIn();
		          }else{
		        	  $scope.toast('退出登录失败');
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
		}

		function _reloadUser() {
//			if ( _isSignIn() ) {
//				API.user.profileGet().then(function (user) {
//					AppAuthenticationService.setUser(user);
//					$scope.user = user;
//					if(user.nickname){
//						$scope.userName = user.nickname;
//					} else {
//                        $scope.userName = user.username;
//					}
//				})
//			};
			console.log($scope.user);
			$scope.userName = $scope.user.userName;
		}

		function _reload() {
			_reloadUser();
			$scope.cartModel.reloadIfNeeded();
		}

		function _isWeixin() {
			return $rootScope.isWeixin();
		}

		function _touchBonus(){
			$state.go('bonus', {});
		}

		function _touchBalance(){
			$state.go('my-balance', {});
		}

		function _isSignIn(){
			return $scope.user.state;
		}

		_reload();
	}

})();