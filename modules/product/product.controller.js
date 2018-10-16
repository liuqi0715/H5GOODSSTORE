(function () {

  'use strict';

  angular
  .module('app')
  .controller('ProductController', ProductController);

  ProductController.$inject = ['$rootScope','$scope', '$http', '$window', '$timeout', '$location', '$state', '$stateParams', 'API', 'ENUM', 'AppAuthenticationService', 'ConfirmProductService', 'CartModel','ConfigModel'];

  function ProductController($rootScope,$scope, $http, $window, $timeout, $location, $state, $stateParams, API, ENUM, AppAuthenticationService, ConfirmProductService, CartModel,ConfigModel) {

  	$scope.user = AppAuthenticationService.getUser();
	  var productId = $stateParams.product;
	 //Scroll对象
	  $scope.getProductDetails = function(){
	    var sendData={
            "data": {
                "goodId": productId
            }
        };
	    $.ajax({
	        type: "post",
	        url: "/stage/getGoodsDescription/",
	        contentType:'application/json',
	        data: JSON.stringify(sendData),
	        dataType : "json",
	        success : function(data){ 
	        	$("#pullUpbox").css({"height":"40px"})
	        	 $scope.productContent = true;
	        	 $("#pContent").html(data.data.content);
	        	 $scope.$apply();
	        	 pullUpEl.style.display = 'none';
		         if(myScroll){
		        	 pullUpState = false;
		        	 setTimeout(function () {
	        	        myScroll.refresh();
	        	     }, 100); 
		         }
	        },
	        error:function(info){
	     	   console.log(info);
	        }
	     });
	  };
		  
      $scope.currentStock = null; //当前库存
      $scope.currentAttrs = [];   //单选属性
      $scope.currentSelectedPrice = 0;   //单选属性
      $scope.input = {
          currentAmount: 1
      };

      $scope.optionalAttrs = []; //多选属性
      $scope.canPurchase = false;//是否可以购买

      $scope.product = null;
      $scope.comments = [];

      $scope.cartModel = CartModel;
      
      $scope.touchAmountSub = _touchAmountSub;
      $scope.touchAmountAdd = _touchAmountAdd;
      $scope.touchAttr = _touchAttr;
      $scope.touchLike = _touchLike;
      $scope.touchComments = _touchComments;
      $scope.touchComment = _touchComment;
      $scope.touchCart = _touchCart;
      $scope.touchAddCart = _touchAddCart;
      $scope.touchPurchase = _touchPurchase;
      $scope.refreshAmount = _refreshAmount;
      $scope.checkdis = _checkdis;
      $scope.recover = _recover;

      $scope.attrVal1=null,$scope.attrVal2=null;
      $scope.attrState1=null,$scope.attrState2=null;
      $scope.formatGrade = _formatGrade;

      $scope.isLoading = false;
      $scope.isLoaded = false;
      $scope.proPaneShow=false;
      $scope.skuId=null;
	  $scope.productContent = false;

	  $scope.loadProductDetails = function(){
		  if($scope.isLoaded == true){
              setTimeout(function(){
                  if($scope.productContent == false){
                    $scope.getProductDetails();
                  } 
              },500);
		  }
	  }
      function _touchAmountSub() {

        if ( $scope.proStore == 0 )
            return;

        var amount = parseInt($scope.input.currentAmount);
        if ( amount <= 1 ){
            $scope.toast('受不了了，宝贝不能再少了');
            return;
        }

          $scope.input.currentAmount = '' + (amount - 1);
      }

      function _refreshAmount(){
          var amount = parseInt($scope.input.currentAmount);
          if(amount == 'NaN'){
        	  $scope.input.currentAmount = 0;
          }else{
        	  $scope.input.currentAmount = amount;
          }
          if (amount < 1) {
              $scope.input.currentAmount = 1+"";
          }else if(amount > $scope.proStore){
        	  $scope.input.currentAmount = $scope.proStore;
          }

      }
      $scope.hasseleG = false;
      function _touchAmountAdd() {

      	var amount = parseInt($scope.input.currentAmount);
      	if ($scope.hasseleG == true){

            if ( $scope.proStore ) {
                if ( $scope.proStore == 0 ){
                    $scope.toast("没有更多库存了")
					return
                }
				if ( amount >= $scope.proStore ){
                    $scope.toast("没有更多库存了")
				}else {
                    $scope.input.currentAmount = '' + (amount + 1);
                }

            }else {

			}
        } else {
      		$scope.toast("请先选择商品类型")
		}


      }
      var innerH = document.body.clientHeight;
	  // alert(innerH+"记录首次的")
      function _checkdis(){
          var newH =  innerH - document.body.clientHeight
		  setTimeout(function () {
				console.log("newH",newH)
		  },500)
		  $(".product-pane").css({"bottom":70+newH+"px"})
		  $(".product-amount .amount-input .input-count").css({"border":"1px solid red"})
	  }

	  function _recover(){
	  	$(".product-pane").css({"bottom":70+"px"})
	    $(".product-amount .amount-input .input-count").css({"border":"1px solid black"})
	  }
      window.onresize=function(){
          if (document.body.clientHeight==innerH){
              $(".product-amount .amount-input .input-count").blur();
		  }
      }

      $scope.proSelected="请选择";
      $scope.sigleNoReper = false;//控制单个库存

      function _touchAttr( property, attr, a, b) {
      	$scope.hasseleG = true;
        //重置掉输入框商品数量
      	$scope.input.currentAmount = 1;

        var attrLens = $scope.product.goodsAttr.length;
        if ( !$scope.product )
        	return;
        if(attr.sign==0){
        	return;
        }
        if(attrLens == 1){

            if($scope.product.goodsAttr[a].attrValueList[b].check==0){
                for(var i=0;i<$scope.product.goodsAttr[a].attrValueList.length;i++){
                	$scope.product.goodsAttr[a].attrValueList[i].check=0;
                }
                $scope.product.goodsAttr[a].attrValueList[b].check=1;
    	    	var tempArray=[];
    	    	tempArray.push(attr);
    		    var sendData1={
    	            "data": {
    	                "goodsId": productId,
    	                "batchList": tempArray
    	            }
    	        };
    		    $.ajax({
    		        type: "post",
    		        url: "/stage/getPrice/",
    		        contentType:'application/json',
    		        data: JSON.stringify(sendData1),
    		        dataType : "json",
    		        success : function(data){  
    		          if(data.errorInfo==null){
    		        	 $scope.proPrice=data.data.salePrice;
    		        	 $scope.proStore=data.data.stockQuantity;
    		        	 if(parseInt($scope.proStore)<=0){
                             $scope.sigleNoReper = true;
						 }else {
                             $scope.sigleNoReper = false;
						 }
    		        	 $scope.skuId=data.data.skuId;
    		        	 $scope.$apply();
    		          }else{
                          $scope.toast(data.errorInfo);
    		          }
    		        },
    		        error:function(info){
    		     	   console.log(info);
    		        }
    		     });
    		    $scope.proSelected="已选择"+" "+attr.attrValue;
            }else if($scope.product.goodsAttr[a].attrValueList[b].check==1){
            	$scope.product.goodsAttr[a].attrValueList[b].check=0;
            	$scope.proSelected="请选择";
            }
            // console.log("$scope.showPic=attr.imgUrl;",attr.imgUrl)
            $scope.showPic=attr.imgUrl;
        }else{
        	if(a==0){
            	$scope.attrVal1=attr;
            	$scope.attrState1=[a,b];
            }else{
            	$scope.attrVal2=attr;
            	$scope.attrState2=[a,b];
            }
            if($scope.product.goodsAttr[a].isMainAttr==1){
            	$scope.mainPos=a;
            }
            var product = $scope.product;
            if($scope.product.goodsAttr[a].attrValueList[b].check==0){
                for(var i=0;i<$scope.product.goodsAttr[a].attrValueList.length;i++){
                	$scope.product.goodsAttr[a].attrValueList[i].check=0;
                }
                $scope.product.goodsAttr[a].attrValueList[b].check=1;
        	    var sendData={
    	            "data": {
    	                "goodsId": $scope.product.goodsId,
    	                "attrId": attr.attrId,
    	                "value": attr.attrValue
    	            }
    	        };
    		    $.ajax({
    		        type: "post",
    		        url: "/stage/whetherToShowAttr/",
    		        contentType:'application/json',
    		        data: JSON.stringify(sendData),
    		        dataType : "json",
    		        success : function(data){ 
    		          if(data.errorInfo==null){
    		        	 for(var i=0;i<$scope.product.goodsAttr.length;i++){
    		        		 if(i!=a){
    		        			 $scope.product.goodsAttr[i].attrValueList=data.data.batchList;
    		        		 }
    		        	 }
    		        	 for(var j=0;j<$scope.product.goodsAttr[0].attrValueList.length;j++){
    		        		 $scope.product.goodsAttr[0].attrValueList[j].check=0;
    		        	 }
    		        	 for(var k=0;k<$scope.product.goodsAttr[1].attrValueList.length;k++){
    		        		 $scope.product.goodsAttr[1].attrValueList[k].check=0;
    		        	 }
    		        	 if($scope.attrState1){
    		        		 $scope.product.goodsAttr[0].attrValueList[$scope.attrState1[1]].check=1; 
    		        	 }
    		        	 if($scope.attrState2){
    		        		 $scope.product.goodsAttr[1].attrValueList[$scope.attrState2[1]].check=1;
    		        	 }
    		        	 $scope.$apply();
    		          }else{
                          $scope.toast(data.errorInfo);
    		          }
    		        },
    		        error:function(info){
    		     	   console.log(info);
    		        }
    		     });
            }else if($scope.product.goodsAttr[a].attrValueList[b].check==1){
            	for(var i=0;i<$scope.product.goodsAttr.length;i++){
                    for(var j=0;j<$scope.product.goodsAttr[i].attrValueList.length;j++){
                    	$scope.product.goodsAttr[i].attrValueList[j].sign=1;
                    }
            	}
                $scope.product.goodsAttr[a].attrValueList[b].check=0;
                if(a == 0){
                	$scope.attrVal1=null;
                	$scope.attrState1=null;
                	if($scope.attrState2){
                		$scope.product.goodsAttr[1].attrValueList[$scope.attrState2[1]].check=1;
                	}
                }else{
                	$scope.attrVal2=null;
                	$scope.attrState2=null;
                	if($scope.attrState1){
                		$scope.product.goodsAttr[0].attrValueList[$scope.attrState1[1]].check=1;
                	}
                }
                $scope.skuId=null;
            }
            if($scope.attrVal1==null && $scope.attrVal2){
            	$scope.proSelected="已选择"+" "+$scope.attrVal2.attrValue;
            }else if($scope.attrVal2==null && $scope.attrVal1){
            	$scope.proSelected="已选择"+" "+$scope.attrVal1.attrValue;
            }else if($scope.attrVal1!=null && $scope.attrVal2!=null){
            	$scope.proSelected="已选择"+" "+$scope.attrVal1.attrValue+" "+$scope.attrVal2.attrValue;
            }else{
            	$scope.proSelected="请选择";
            }
            $scope.showPic=attr.imgUrl;

    	    if($scope.attrVal1!=null && $scope.attrVal2!=null){
    	    	var tempArray=[];
    	    	tempArray.push($scope.attrVal1);
    	    	tempArray.push($scope.attrVal2);
    		    var sendData1={
    	            "data": {
    	                "goodsId": productId,
    	                "batchList": tempArray
    	            }
    	        };
    		    $.ajax({
    		        type: "post",
    		        url: "/stage/getPrice/",
    		        contentType:'application/json',
    		        data: JSON.stringify(sendData1),
    		        dataType : "json",
    		        success : function(data){  
    		          if(data.errorInfo==null){
    		        	 $scope.proPrice=data.data.salePrice;
    		        	 $scope.proMarketPrice=data.marketPrice;
    		        	 $scope.proStore=data.data.stockQuantity;
                          if( parseInt($scope.proStore) <=0){
                              $scope.sigleNoReper = true;
                          }else {
                              $scope.sigleNoReper = false;
						  }
    		        	 $scope.skuId=data.data.skuId;
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
        }
        
      }

      function _touchComments() {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchComment( comment ) {
          $state.go('comment', {
            product: productId
          });
      }

      function _touchCart() {
        $state.go('cart', {});
      }

      function _touchLike(product){
    	 if($scope.product.isCollect == 1){
    		 $scope.product.isCollect = 0;
    	 }else{
    		 $scope.product.isCollect = 1; 
    	 }
  	    var sendData={
	        "data": {
	            "goodsId": product.goodsId,
	            "isCollect": $scope.product.isCollect
	        }
        };
	    $.ajax({
	        type: "post",
	        url: "/stage/updateIsCollect/",
	        contentType:'application/json',
	        data: JSON.stringify(sendData),
	        dataType : "json",
	        success: function(data){ 
	          if(data.errorInfo==null){
	        	  if($scope.product.isCollect == 0){
	        		  $scope.toast('取消收藏');
	        	  }else{
	        		  $scope.toast('收藏成功');
	        	  }
	        	  $scope.$apply();
	          }else{
	        	  $scope.toast(data.errorInfo);
	          }
	        },
	        error:function(info){
	     	   console.log(info);
	        }
	     });
//        if ( !AppAuthenticationService.getToken() ) {
//          $scope.goSignin();
//          return;
//        }
//
//        if ( $scope.product.is_liked ) {
//            $scope.product.is_liked = false;
//            API.product
//            .unlike({product:productId})
//            .then(function(is_liked){
//              $scope.product.is_liked = is_liked;
//              $scope.toast('取消收藏');
//            }, function(error){
//              $scope.product.is_liked = true;
//            });
//        } else {
//            $scope.product.is_liked = true;
//            API.product
//            .like({product:productId})
//            .then(function(is_liked){
//              $scope.product.is_liked = is_liked;
//              $scope.toast('收藏成功');
//            }, function(error){
//              $scope.product.is_liked = false;
//            });
//        }
      }

      function _touchAddCart() {

          if($scope.user.state == false){
			 $rootScope.goSignin();
              $scope.toast('请先登录');

		}else if( $scope.product.stock<=0){
              $scope.toast('商品卖完了,过几天再来吧');

              return;
	  	}else if ($scope.product.status!=2){
              $scope.toast('商品已下架');
              return;
		  }else if ($scope.sigleNoReper==true){
              $scope.toast('单类商品库存量不足');
              return;
		  } else {

	    	if($scope.skuId==null){
	    		$scope.toast('请先选择商品');
	    		return;
	    	}
	        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
	        var amount = $scope.input.currentAmount;
		    var sendData={
	            "data": {
	                "goodId": productId,
	                "skuId": $scope.skuId,
	                "number": amount,
	                "marketPrice":$scope.proMarketPrice,
	                "sellPrice":$scope.proPrice
	            }
	        };

		    $.ajax({
		        type: "post",
		        url: "/stage/addShopCart/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	 $scope.toast('已添加到购物车');
                      setTimeout(function () {
					  	$scope.paneHide();
                      },1000)
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
      }

      function _touchPurchase() {
      	if($scope.user.state == false){
			 $rootScope.goSignin();
		}if( $scope.product.stock<=0){
              $scope.toast('商品卖完了,过几天再来吧');

              return;
          }else if($scope.product.status!=2){
              $scope.toast('商品已下架');
              return;
		  }else if ($scope.sigleNoReper==true){
              $scope.toast('单类商品库存量不足');
              return;
		  }else {
	     	if($scope.skuId==null){
	    		$scope.toast('请先选择商品');
	    		return;
	    	}
	      	 var amount = parseInt($scope.input.currentAmount);
	      	if(amount){
	      		if(amount == 0){
	          		$scope.toast('请填写数量');
	          		return;
	      		}
	      	}else{
	      		$scope.toast('请填写数量');
	      		return;
	      	}
	        var product = $scope.product;
	        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);
	        var amount = $scope.input.currentAmount;

	        ConfirmProductService.clear();
	        ConfirmProductService.product = product;
	        ConfirmProductService.attrs = attrs;
	        ConfirmProductService.amount = amount;

		    var sendData={
	            "data": {
	            	"isBuy":0,
	                "goodList": [
	                    {
	                        "skuId": $scope.skuId,
	                        "number": $scope.input.currentAmount
	                    }
	                ]
	            }
	        };
		    var sent=JSON.stringify(sendData);
	        $state.go('confirm-product', {sendData:sent});
		}
     }

      function _refreshPrice(){
        var attrs = [].concat($scope.currentAttrs).concat($scope.optionalAttrs);

          $scope.currentSelectedPrice = parseInt($scope.product.current_price);

          for ( var i = 0; i < $scope.product.properties.length; ++i ) {
            var property = $scope.product.properties[i];
            
            for ( var j in property.attrs ) {              
                var index = attrs.indexOf( property.attrs[j].id );
                if ( -1 != index && property.attrs[j].attr_price)  {
                    $scope.currentSelectedPrice += parseInt(property.attrs[j].attr_price);
                }              
            }
          }

      }

      function _formatGrade( grade ) {
        if ( ENUM.REVIEW_GRADE.BAD == grade ) {
          return '差评';
        } else if ( ENUM.REVIEW_GRADE.MEDIUM == grade ) {
          return '中评';
        } else if ( ENUM.REVIEW_GRADE.GOOD == grade ) {
          return '好评';
        }
        return '中评';
      }

      var myScroll,
      pullDownEl, pullDownOffset,
      pullUpEl, pullUpOffset,
      generatedCount = 0,
      pullUpState = false;


      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
          if(myScroll){
              myScroll.destroy();
          }
      });
      /**
       * 下拉刷新 
       */
      function pullDownAction () {
        _reloadProduct();
      }
       
      /**
       * 滚动翻页 
       */
      function pullUpAction () {
        if($scope.productContent == false){
        	 $scope.getProductDetails();
        } 
      }
      /**
       * 滚动中
       */
	  function scrollMove() {
	       if (this.y > 5 && !pullDownEl.className.match('flip')) {
	        pullDownEl.className = 'flip';
	        pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
	        this.minScrollY = 0;
	       } else if (this.y < 5 && pullDownEl.className.match('flip')) {
	        pullDownEl.className = '';
	        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
	        this.minScrollY = -pullDownOffset;
	       } else if (this.y < (this.maxScrollY - 60) && !pullUpEl.className.match('flip')) {
	        pullUpEl.className = 'flip';
	        pullUpState = true;
	        pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
	        this.maxScrollY = this.maxScrollY;
	       } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
	        pullUpEl.className = '';
	        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
	        this.maxScrollY = pullUpOffset;
	        pullUpState = false;
	       }else{
	    	   if(pullUpState == true){
	    		   setTimeout(function(){
	    			   myScroll.refresh();
	    		   },1500);
	    	   }
	       }
	    };
      /**
       * 滚动结束
       */
	   function scrollEnd() {
	       if (pullDownEl.className.match('flip') && pullUpState == false) {
	        pullDownEl.className = 'loading';
	        pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';    
//	        pullDownAction();
	       } else if (pullUpEl.className.match('flip')) {
	        pullUpEl.className = 'loading';
	        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';    
	        pullUpAction(); // Execute custom function (ajax call?)
	       }else{
	    	   
	       }
//	       pullDownEl.style.display = 'none';else if($('.pullDownLabel').html() == '下拉刷新...' && pullUpState == false){
//    	   myScroll.scrollTo(0, -pullDownOffset, 0, IScroll.utils.ease.elastic);
//       }
	    };
      
       function loaded() {
    	  pullDownEl = document.getElementById('pullDown');
    	  pullDownOffset = pullDownEl.offsetHeight;
    	  pullUpEl = document.getElementById('pullUp'); 
    	  pullUpOffset = pullUpEl.offsetHeight;
    	  pullDownEl.style.display = 'none';
    	  myScroll = new IScroll('#wrapper', {
    	    mouseWheel: true,
    	    click:true,
    	    probeType:3,
    	    scrollbarClass: 'myScrollbar', /* 重要样式 */
    	    useTransition: false, /* 此属性不知用意，本人从true改为false */
    	    topOffset: pullDownOffset
    	  });


    	  if($("#pullUpbox").offset().top < $(window).height()){

    	  	$("#pullUpbox").height($(window).height() - $("#pullUpbox").offset().top + 10);
    	  	myScroll.refresh();
		  }
//    	  myScroll.scrollTo(0, -pullDownOffset, 0, IScroll.utils.ease.elastic);
    	}
      
      function _reloadProduct() {
        $scope.isLoading = true;
	    var sendData={
	            "data": {
	            	"goodsId": productId
	            }
        };
	    $.ajax({
	        type: "post",
	        url: "/stage/getGoodsDetails/",
	        contentType:'application/json',
	        data: JSON.stringify(sendData),
	        dataType : "json",
	        success: function(data){  
	          if(data.errorInfo==null){
	        	 $scope.isLoaded = true;
	        	 $scope.product=data.data;
	        	 $scope.currentStock=$scope.product.stock;
	        	 $scope.showPic=$scope.product.pic[0].pic;
	             $scope.proPrice=$scope.product.costPrice;
	             $scope.proStore=$scope.currentStock;
	             if($scope.product.skuId != -1){
	            	 $scope.skuId = $scope.product.skuId; 
	             }
		         if ($scope.product.pic && $scope.product.pic.length > 1 ) {
		            var timer = $timeout( function() {
		                $scope.flashSwiper = new Swiper('.product-flash', {
		                    pagination: '.swiper-pagination',
		                    paginationClickable: true,
		                    spaceBetween: 30,
		                    centeredSlides: true,
		                    autoplay: 1500,
		                    autoplayDisableOnInteraction: false,
		                    loop: true
		                });
		            }, 1 );
		          } else {
		            var timer = $timeout( function() {
		                $scope.flashSwiper = new Swiper('.product-flash', {
		                    pagination: '.swiper-pagination',
		                    paginationClickable: false,
		                    spaceBetween: 30,
		                    centeredSlides: true,
		                    autoplay: 0,
		                    autoplayDisableOnInteraction: false,
		                    loop: false
		                });
		            }, 1 );
		         }
		         if(myScroll){
		        	 myScroll.refresh(); 
		         }
	        	 $scope.$apply();
	        	 setTimeout(function(){
	        		  loaded();
	        		  myScroll.on('scroll', scrollMove);
	        		  myScroll.on('scrollEnd', scrollEnd);
	        	 },100);
	          }else{
                  $scope.toast(data.errorInfo);
	          }
	        },
	        error:function(info){
	     	   console.log(info);
	        }
	     });
      }
      function _reloadComments() {
        if ( !$scope.product )
          return;

        API.review
        .productList({
            product:productId,
            grade:ENUM.REVIEW_GRADE.ALL,
            page:1,
            per_page:MAX_COMMENTS
        }).then(function(comments){
            $scope.comments = comments;
        });
      }

      function _reload() {
        _reloadProduct();
      }
      $scope.proPaneShow=false;
      $scope.selectClick=function(){
    	  $scope.proPaneShow=true;
    	  $scope.paneShow();
      };
      $scope.paneShow=function(){
    	  var el=null,winH=null,paneH=null;
	      setTimeout(function(){
	    	  winH=$(window).height();
	    	  paneH=$(window).height()/2+100;
	    	  $("#pro").height(paneH);
	    	  el=document.getElementById("pro");
	    	  el.style.webkitTransform = 'translate3d(0,'+ winH +'px, 0)';
	    	  $("#pro").show();
	      },100);
	      setTimeout(function(){
	          el.style.webkitTransition = '-webkit-transform 0.2s ease-out';
	          el.style.webkitTransform = 'translate3d(0,'+ (winH-paneH) +'px, 0)';
	      },150);
	  };
	  $scope.paneHide=function(){
          $(".product-amount .amount-input .input-count").blur();
    	  var winH=$(window).height();
    	  var paneH=$(window).height()/2+100;
    	  $("#pro").height(paneH);
    	  var el=document.getElementById("pro");
          el.style.webkitTransition = '-webkit-transform 0.2s ease-out';
          el.style.webkitTransform = 'translate3d(0,'+ winH +'px, 0)';
	      setTimeout(function(){
	    	  $scope.proPaneShow=false;
	    	  $scope.$apply();
	      },200);
	  };
      _reload();
  }
})();
