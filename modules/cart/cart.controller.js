(function () {

	'use strict';

	angular
		.module('app')
		.controller('CartController', CartController);

	CartController.$inject = ['$scope', '$http', '$rootScope', '$location', '$state', 'ConfirmCartService', 'AppAuthenticationService'];

	function CartController($scope, $http, $rootScope, $location, $state, ConfirmCartService, AppAuthenticationService) {
  	    function isSignIn(){
  		  var user = AppAuthenticationService.getUser();
  		  if(user.state == false){
  			  $rootScope.goSignin();
  		  }
  	    }
  	    isSignIn();
  	    
		$scope.showDialog = false;

		$scope.deletingGoods = null;
		$scope.touchDelete = _touchDelete;
		$scope.touchDialogCancel = _touchDialogCancel;
		$scope.touchDialogConfirm = _touchDialogConfirm;
		$scope.touchProduct = _touchProduct;
		$scope.touchSubmit = _touchSubmit;

		$scope.touchnumberSub = _touchnumberSub;
		$scope.touchnumberAdd = _touchnumberAdd;

		$scope.touchSelect = _touchSelect;
		$scope.touchSelectAll = _touchSelectAll;
		$scope.isSelected = _isSelected;
		$scope.storeSelect = _storeSelect;
		
		$scope.isSelectedAll = false;
		$scope.selectedGoods = [];
		$scope.selectednumber = 0;
		$scope.selectedPrice = 0;

//		$scope.cartgroups = cartgroups;
        $scope.shopList=[]
		$scope.cartgroups={};
		$scope.cartgroups.isLoaded=false;
		$scope.selectedAmount=0;

		function _touchDelete(idx,shop) {
			$scope.delectShop = shop;
			$scope.deletingGoods=idx;
			$scope.showDialog = true;

		}

		function _touchDialogCancel() {
			$scope.showDialog = false;
			$scope.deletingGoods = null;
            $scope.delectShop = null;
		}

		function _touchDialogConfirm() {
			if ($scope.deletingGoods==null)
				return;
	        var sendData={
	            "data": {
	            	"recId": $scope.delectShop.goodCartList[$scope.deletingGoods].recId
	            }
	        };
		    $.ajax({
		        type: "post",
		        url: "/stage/delShopCart/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
                      if(data.data.success==1){
		        		 // $scope.cartgroups.splice($scope.deletingGoods,1);
                          $scope.delectShop.goodCartList.splice($scope.deletingGoods,1)
						  $scope.toast("删除成功");
                          var s = 0,g = 0;
                          for (var i=0;i<$scope.shopList.length;i++){
                          		if ($scope.shopList[i].goodCartList.length==0){
                          			$scope.shopList.splice(i,1)
                          		}
                          		for(var p=0;p<$scope.shopList[i].goodCartList.length;p++){
                          			if ($scope.shopList[i].goodCartList[p].check==true||$scope.shopList[i].goodCartList[p].understock==true){
                          				g++
										if (g==$scope.shopList[i].goodCartList.length||$scope.shopList[i].checkStore==true){
                                            s++
                                            if (s==$scope.shopList.length){
                                                $scope.selectAllState=true
                                            }
										}
										if (g==$scope.shopList[i].goodCartList.length){
                                            $scope.shopList[i].checkStore=true
										}
									}
								}

						  }
                          _recomputePrice();
                          _countSelected();
			        	 $scope.$apply();
		        	 }
		          }else{
                      $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		    });
			$scope.showDialog = false;
			// $scope.deletingGoods = null;		成功后不能将第一个参数设置为null  不然会出现删除位置错误的情况；
		}

		function _touchProduct(product) {

			$state.go('product', {
				product: product.goodsId
			});
		}

		function _touchSubmit() {
			if ($scope.selectedAmount==0) {
				$scope.toast('请先选择商品');
				return;
			}
			var goodList = [];
			for(var i=0;i<$scope.shopList.length;i++){

                for (var p=0;p<$scope.shopList[i].goodCartList.length;p++){
                	if ($scope.shopList[i].goodCartList[p].check==true){
                        goodList.push($scope.shopList[i].goodCartList[p]);
					}
                }
            }

		    var sendData={
	            "data": {
	            	"isBuy":1,
	                "goodList": goodList
	            }
	        };
		    var sent=JSON.stringify(sendData);
	        $state.go('confirm-product', {sendData:sent});
		}
		function _touchnumberAdd(idx,shop) {

			if (shop.goodCartList[idx].limitedSurplusQuantity!==null){
                if(shop.goodCartList[idx].number<shop.goodCartList[idx].limitedSurplusQuantity){
                    shop.goodCartList[idx].number++;
                }else if(shop.goodCartList[idx].number==shop.goodCartList[idx].limitedSurplusQuantity){
                    shop.goodCartList[idx].number=shop.goodCartList[idx].limitedSurplusQuantity;
                    $scope.toast("此商品限购剩余数量"+shop.goodCartList[idx].limitedSurplusQuantity+"件")

				}else {
					$scope.toast("此商品限购剩余数量"+shop.goodCartList[idx].limitedSurplusQuantity+"件")
					// shop.goodCartList[idx].number=shop.goodCartList[idx].limitedSurplusQuantity;
					shop.goodCartList[idx].understock = false;

                }
                _recomputePrice();
			}else {
                if(shop.goodCartList[idx].number<shop.goodCartList[idx].stockQuantity){
                    shop.goodCartList[idx].number++;
                }else{
                    if (shop.goodCartList[idx].stockQuantity==0){
                        $scope.toast("没有更多库存了")
                    } else {
                        shop.goodCartList[idx].number=shop.goodCartList[idx].stockQuantity;
                        shop.goodCartList[idx].understock = false;
                        if ($scope.selectAllState==true){
                            shop.goodCartList[idx].check = true;
                        }
                    }

                }
                _recomputePrice();
			}

		}

		function _touchnumberSub(idx,shop) {
			if(shop.goodCartList[idx].number>1){
                shop.goodCartList[idx].number--;

				if(shop.goodCartList[idx].number>shop.goodCartList[idx].stockQuantity){
                    shop.goodCartList[idx].understock = false
                    shop.goodCartList[idx].number = shop.goodCartList[idx].stockQuantity;
                    if ($scope.selectAllState==true){
                        shop.goodCartList[idx].check = true;
                    }
                    if (shop.checkStore==true){
                        shop.goodCartList[idx].check = true;
					}

				}
			}else{
                $scope.toast("不能再少了")
                shop.goodCartList[idx].number=1;
			}
			_recomputePrice();
		}


        $scope.selectAllState=false;
		function _touchSelect(idx,shop) {
			if (shop.goodCartList[idx].understock==true){
				$scope.toast("库存不足，请减少购买数量")
			}else {
				if(shop.goodCartList[idx].limitedSurplusQuantity==0){
					$scope.toast("此商品剩余限购数量为0")
					return;
				}
                shop.goodCartList[idx].check=!shop.goodCartList[idx].check;
                var gl=0,sl=0;
                for (var i=0;i<shop.goodCartList.length;i++){
					if (shop.goodCartList[i].check==true||shop.goodCartList[i].understock==true){
                        gl++
						if(gl==shop.goodCartList.length){
                            shop.checkStore = true;
						}
					} else if (shop.goodCartList[i].check==false) {
                        $scope.selectAllState=false;
                        shop.checkStore=false;
					}
                }
                for (var p=0;p<$scope.shopList.length;p++){
                    if ($scope.shopList[p].checkStore==true){
                        sl++
                    }
                }
                if (sl==$scope.shopList.length){
                    $scope.selectAllState=true;
                }
                _recomputePrice();
                _countSelected();
			}

		}
        function _storeSelect(idx,shoplist) {
            $scope.shopList[idx].checkStore = !$scope.shopList[idx].checkStore;
            if($scope.shopList[idx].checkStore==true){
            	var noGoods = 0;
                for(var i=0;i<$scope.shopList[idx].goodCartList.length;i++){
                    if ($scope.shopList[idx].goodCartList[i].understock==false){
                        $scope.shopList[idx].goodCartList[i].check=true;
                    }
                    if ($scope.shopList[idx].goodCartList[i].understock==true){
                        noGoods++
					}
                }
                if (noGoods==$scope.shopList[idx].goodCartList.length) {
                	$scope.toast("店铺内没有有效的商品")
                    $scope.shopList[idx].checkStore = false;
				}
                var tl = 0;
                for (var i=0;i<$scope.shopList.length;i++){
                    if( $scope.shopList[i].checkStore==true){
                        tl++;
                    }else if($scope.shopList[i].checkStore==false){
                        $scope.selectAllState=false;
                    }
				}
                if(tl == $scope.shopList.length){
                    $scope.selectAllState=true;
                }
            }else{
                for(var i=0;i<$scope.shopList[idx].goodCartList.length;i++){
                    if ($scope.shopList[idx].goodCartList[i].understock==false){
                        $scope.shopList[idx].goodCartList[i].check=false;
                    }
                }
                $scope.selectAllState=false;
            }
            _recomputePrice();
            _countSelected();
        }
		function _touchSelectAll() {
			$scope.selectAllState=!$scope.selectAllState;
			if($scope.selectAllState==true){
				for (var p=0;p<$scope.shopList.length;p++){
					$scope.shopList[p].checkStore=true;
					for (var i=0;i<$scope.shopList[p].goodCartList.length;i++){
						if ($scope.shopList[p].goodCartList[i].understock==true||$scope.shopList[p].goodCartList[i].limitedSurplusQuantity<1 && $scope.shopList[p].goodCartList[i].limitedSurplusQuantity!=null){
                            $scope.shopList[p].goodCartList[i].check=false;
                            console.log("??",$scope.shopList[p].goodCartList[i].understock,$scope.shopList[p].goodCartList[i].limitedSurplusQuantity)
						} else {
                            $scope.shopList[p].goodCartList[i].check=true;
                            console.log("??")
						}
					} 
				}
			}else{
				
				for (var p=0;p<$scope.shopList.length;p++){
                    $scope.shopList[p].checkStore=false;
                    for (var i=0;i<$scope.shopList[p].goodCartList.length;i++){
                            $scope.shopList[p].goodCartList[i].check=false;

                    }
                }
			}
			_recomputePrice();
			_countSelected();
		}
		function _isSelected(goods) {
			var selectedGoods = $scope.selectedGoods;
			for (var i = 0; i < selectedGoods.length; ++i) {
				if (goods.id == selecoods[i].id) {
					return true;
				}
			}
			return false;
		}
		//数据的加减
        $scope.selectDiscount = 0;
        function _recomputePrice() {
            // console.info(Math.floor(1/4));
            // console.info(Math.floor(4/4));
            // console.info(Math.floor(6/4));
			var number = 0;
			var price = 0;



			var goods = $scope.shopList;
			var newArr=[];	//新的有活动满减的商品
			var newArrId=[];//将商品Id放进去，重复的去除

			var arrA ={};
			var price2={};	//有活动类商品的每一类的价格
			var number2={};	//有活动类商品的每一类的数量
			var PRICETRUE=0;
			var DISCOUNTTRUE=0;
            var discount = {};//有活动类商品的每一类的优惠价格
			for (var i = 0; i < goods.length; ++i) {

				for (var p=0;p<goods[i].goodCartList.length;p++){
                    if(goods[i].goodCartList[p].check==true){
						if (goods[i].goodCartList[p].activityDescription==null){
							//正常价格
                            number += goods[i].goodCartList[p].number;
                            price += goods[i].goodCartList[p].number * goods[i].goodCartList[p].salePrice;
						}else if (goods[i].goodCartList[p].activityDescription!=null&&goods[i].goodCartList[p].activityDiscountAmount==null){
							//限时特价
                            number += goods[i].goodCartList[p].number;
                            price += goods[i].goodCartList[p].number * goods[i].goodCartList[p].salePrice;

						}else {
							//满减
							if ( newArrId.indexOf(goods[i].goodCartList[p].goodsId)==-1){
                                newArrId.push(goods[i].goodCartList[p].goodsId)

							}
                            newArr.push(goods[i].goodCartList[p])
							//console.log(newArrId,newArr,"newArrId")

							// number += goods[i].goodCartList[p].number;
                            // price += goods[i].goodCartList[p].number * goods[i].goodCartList[p].salePrice - (Math.floor(goods[i].goodCartList[p].number/goods[i].goodCartList[p].activityStartQuantity)*goods[i].goodCartList[p].activityDiscountAmount);
                            // discount += (Math.floor(goods[i].goodCartList[p].number/goods[i].goodCartList[p].activityStartQuantity)*goods[i].goodCartList[p].activityDiscountAmount)
						}


                    }
				}

			}
			for (var s=0;s<newArrId.length;s++){
                arrA[newArrId[s]] = new Array();
				for (var n=0;n<newArr.length;n++){
					if (newArr[n].goodsId==newArrId[s]){
                       arrA[newArrId[s]].push(newArr[n]);
					}
				}
			}



			for (i in arrA){
                number2[i]=0;
                price2[i]=0;
                discount[i]=0;
				for (var t=0;t<arrA[i].length;t++){
					number2[i]+=arrA[i][t].number;
					// console.log(arrA[i][t].number)
                    if(number2[i]>=arrA[i][t].activityStartQuantity){
                        price2[i]+=(arrA[i][t].number)*(arrA[i][t].salePrice)-(Math.floor(number2[i]/arrA[i][t].activityStartQuantity)*arrA[i][t].activityDiscountAmount);
                    }else {
                        price2[i]+=(arrA[i][t].number)*(arrA[i][t].salePrice)
                    }
                    discount[i]=(Math.floor(number2[i]/arrA[i][t].activityStartQuantity)*arrA[i][t].activityDiscountAmount);
				}
				console.log(price2,number2, discount,"arrA[i]")
			}
			for (t in price2){
                PRICETRUE+= price2[t];
			}
			for (t in discount){
				DISCOUNTTRUE+=discount[t];
			}

			$scope.selectednumber = number+number2;
			$scope.selectedPrice = price+PRICETRUE;
			$scope.selectDiscount = DISCOUNTTRUE;
            console.log($scope.selectDiscount,$scope.selectedPrice,"selectDiscount")
		}

        function _countSelected(){
            var count=0;
            for(var i=0;i<$scope.shopList.length;i++){
            	for (var p=0;p<$scope.shopList[i].goodCartList.length;p++){
                    if($scope.shopList[i].goodCartList[p].check==true){
                        count++;
                    }
				}
            }
            $scope.selectedAmount=count;
        }


		//新的购物车接口

		function getCartData() {
            var sendData={
                "data": {}
            };
            $.ajax({
                type: "post",
                url: "/stage/getCart/",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
						$scope.shopList = data.data.shopList;
						for (var p=0;p<$scope.shopList.length;p++) {
                            $scope.cartgroups=$scope.shopList[p].goodCartList;
                            $scope.shopList[p].checkStore = false;
                            for(var i=0;i<$scope.cartgroups.length;i++){
                                $scope.cartgroups[i].check=false;
                                if ($scope.cartgroups[i].stockQuantity < $scope.cartgroups[i].number){
                                    $scope.cartgroups[i].understock=true;
                                }else if($scope.cartgroups[i].stockQuantity==$scope.cartgroups[i].number){
                                    $scope.cartgroups[i].understock=false;
                                }else if($scope.cartgroups[i].stockQuantity>$scope.cartgroups[i].number){
                                    $scope.cartgroups[i].understock=false;
                                }
                                if ($scope.cartgroups[i].number>$scope.cartgroups[i].stockQuantity){
                                    // $scope.cartgroups[i].number = $scope.cartgroups[i].stockQuantity;
                                }
                            }
						}
                        $scope.cartgroups.isLoaded=true;
                        $scope.$apply();
                    }else{
                        $scope.toast(data.errorInfo);
                    }
                },
                error:function(info){
                    console.log(info);
                }
            });
        }
        getCartData();

	}

})();