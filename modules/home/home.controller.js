(function() {

    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$http', '$rootScope', '$timeout', '$location', '$state', 'API', 'ENUM', 'CONSTANTS', '$window', 'AppAuthenticationService', 'CartModel', 'ConfigModel'];

    function HomeController($scope, $http, $rootScope, $timeout, $location, $state, API, ENUM, CONSTANTS, $window, AppAuthenticationService, CartModel, ConfigModel) {
        var MAX_BANNERS = 10;
        var MAX_NOTICES = 5;
        var MAX_CATEGORIES = 4;
        var MAX_PRODUCTS = 4;

        $scope.banners = [];
        $scope.notices = [];
        // var emptyCategory = {};
        // var emptyCategories = [];

        // for ( var i = 0; i < MAX_CATEGORIES; ++i ) {
        //   emptyCategories.push( emptyCategory );
        // }

        // $scope.categories = emptyCategories;

        var emptyProduct = {};
        var emptyProducts = [];

        for (var i = 0; i < MAX_PRODUCTS; ++i) {
            emptyProducts.push(emptyProduct);
        }

        $scope.topSale = emptyProducts;
        $scope.newArrival = emptyProducts;
        $scope.editorChoice = emptyProducts;

        $scope.touchSearch = _touchSearch;
        $scope.touchBanner = _touchBanner;
        $scope.touchNotice = _touchNotice;
        $scope.touchCategory = _touchCategory;
        $scope.touchProduct = _touchProduct;
        $scope.touchGroup = _touchGroup;

        $scope.reload = _reload;
        $scope.loadMore = _loadMore;
        $scope.gobackHis = _gobackHis;
        $scope.getMoreList = _getMoreList;
        $scope.cartModel = CartModel;
        /**
         *對url和token進行驗證
         * @type {string}
         */
        function _getMoreList(block) {
            console.log(block,"tag_id");
            $state.go('search-result', {
                "tagId":block.tagId,
                "tagName":block.tagName
            });
        }

        function _gobackHis() {
            // window.history.back();
            window.location.href = 'mobile/close';
            // if(history.length==1){
            //     window.open('mobile/close');
            // }else if(history.length==0){
            //     window.open('mobile/close');
            // }else {
            //     history.back();
            // }
        }




        function _touchSearch() {
            $state.go('search', {});

        }

        function _touchBanner(banner) {
            if (!banner.link || !banner.link.length) {
                $scope.toast('没有链接');
                return;
            }
            var token = localStorage.getItem("token")
            // $window.location.href = banner.link+"&access_token="+token;
            var hasparam = "?";
            if ((banner.link).toString().indexOf(hasparam)!=-1){
                $window.location.href = banner.link+"&access_token="+token;
            } else {
                $window.location.href = banner.link
            }

        }

        function _touchNotice(notice) {

            var url = '';
            if (notice.link.indexOf("http://", 0) == -1) {
                url = "http://" + notice.link;
            } else {
                url = notice.link;
            }
            $window.location.href = url;
        }

        function _touchGroup(group) {
            $state.go('home', {

            });
        }

        function _touchCategory(category) {
            $state.go('search-result', {
                sortKey: ENUM.SORT_KEY.DEFAULT,
                sortValue: ENUM.SORT_VALUE.DEFAULT,
                keyword: null,
                category: category.id,
                navTitle: category.name,
                navStyle: 'default'
            });

        }
        localStorage.setItem("STop",0)
        window.addEventListener("scroll",scrollTop,true);
        $rootScope.STOP = 0;

        var st=null;
        function scrollTop() {
            if ($(window).scrollTop()==0){
            }else {
                localStorage.setItem("STop",$(window).scrollTop());
            }
        }
        function _touchProduct(product) {
            $state.go('product', {
                product: product.goodsId,
            });
        }

        function _reloadBanners() {
            $.ajax({
                type: "post",
                url: "/website/getBanners/",
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
                        $scope.banners = data.data.banners;
                        var timer = $timeout(function() {
                            $scope.bannerSwiper = new Swiper('.home-banner', {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                spaceBetween: 30,
                                centeredSlides: true,
                                autoplay: 1500,
                                autoplayDisableOnInteraction: false,
                                loop: true,
                            });
                        }, 1);
                        $scope.$apply();
                    } else {
                        $scope.toast(data.errorInfo);
                    }
                },
                error: function(info) {
                    console.log(info);
                }
            });

        }

        function _reloadNotices() {
            $.ajax({
                    type: "post",
                    url: "/website/getNotiesList/",
                    contentType: 'application/json;charset=utf-8',
                    dataType: "json",
                    success: function(data) {
                        if (data.errorInfo == null) {
                           $scope.notices = data.data.noties;
                            var timer = $timeout(function() {
                                $scope.noticeSwiper = new Swiper('.notice-slide', {
                                    spaceBetween: 30,
                                    centeredSlides: true,
                                    autoplay: 1500,
                                    autoplayDisableOnInteraction: false,
                                    direction: 'vertical',
                                    loop: true
                                });
                            }, 1);
                            $scope.$apply();
                        } else {
                            $scope.toast(data.errorInfo);
                        }
                    },
                    error: function(info) {
                        console.log(info);
                    }
                });

        }

        function _reloadCategories() {
            API.category
                .list({
                    page: 1,
                    per_page: MAX_CATEGORIES
                })
                .then(function(categories) {
                    $scope.categories = categories;
                });
        }

        function _reloadEditorChoice() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.POPULAR,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.editorChoice = products;
                });
        }

        function _reloadTopSale() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.SALE,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.topSale = products;
                });
        }

        function _reloadNewArrival() {
            API.product
                .list({
                    page: 1,
                    per_page: MAX_PRODUCTS,
                    sort_key: ENUM.SORT_KEY.DATE,
                    sort_value: ENUM.SORT_VALUE.DESC
                })
                .then(function(products) {
                    $scope.newArrival = products;
                });
        }

        function _reloadHomeList() {
            var sendData = {
                "data": {}
            };
            $.ajax({
                type: "post",
                url: "/stage/getHomePage/",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(sendData),
                // data: sendData,
                dataType: "json",
                success: function(data) {
                    if (data.errorInfo == null) {
                        $scope.homeList = data.data.tagList;
                        $scope.$apply();
                    } else {
                        $scope.toast(data.errorInfo);
                    }
                },
                error: function(info) {
                    console.log(info);
                }
            });

        }

        function _reload() {
            _reloadBanners();
            _reloadNotices();

            _reloadHomeList();
            ConfigModel.fetch().then(function() {

            });


            $scope.cartModel.reloadIfNeeded();
        }
        $scope.flag = false;
        function _loadMore(el) {
            // TODO:
        }
        var timestart;
        var timeend;
        document.getElementById("scroll-content-listen").addEventListener("touchstart",function (ev) {
            timestart = Math.floor(new Date().getTime())

        })
        document.getElementById("scroll-content-listen").addEventListener("touchend",function (ev) {
            timeend =  Math.floor(new Date().getTime() - timestart);

            if (timeend>140){

                $scope.flag = false;
                // ev.preventDefault();
            }else {
                $scope.flag = true;
            }
        })
        document.getElementById("scroll-content-listen").addEventListener("touchmove",function (ev) {


        })
        function _initConfig(wechat, url) {

            if (!wechat) {
                return;
            };

            wx.config({
                debug: GLOBAL_CONFIG.DEBUG, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wechat.app_id, // 必填，公众号的唯一标识
                timestamp: wechat.timestamp, // 必填，生成签名的时间戳
                nonceStr: wechat.nonceStr, // 必填，生成签名的随机串
                signature: wechat.signature, // 必填，签名，见附录1
                jsApiList: ['chooseWXPay',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            var shared_link = url;

            wx.ready(function() {
                wx.onMenuShareTimeline({
                    title: '推荐分成', // 分享标题
                    desc: '',
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: '推荐分成', // 分享标题
                    desc: '',
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareQQ({
                    title: '推荐分成', // 分享标题
                    desc: '', // 分享描述
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareWeibo({
                    title: '推荐分成', // 分享标题
                    desc: '', // 分享描述
                    link: shared_link, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

            });

            wx.error(function(res) {
                if (GLOBAL_CONFIG.DEBUG) {
                    $rootScope.toast(JSON.stringify(res));
                }
            });

        }

        function _initShared() {
            if (!AppAuthenticationService.getToken()) {
                return;
            }
            API.bonus.get().then(function(bonus_info) {
                ConfigModel.fetch().then(function() {
                    var config = ConfigModel.getConfig();
                    var wechat = config['wxpay.web'];
                    _initConfig(wechat, bonus_info.shared_link);
                    return true;
                });
            });
        }

        _reload();

    }

})();