(function () {

	'use strict';

	angular
		.module('app')
		.controller('AddressEditController', AddressEditController);

	AddressEditController.$inject = ['$scope', '$http','API', '$location', '$q', '$window', '$state', '$stateParams', 'AddressEditModel'];

	function AddressEditController($scope, $http,API, $location, $q, $window, $state, $stateParams, AddressEditModel) {
		var isEdit=$stateParams.isEdit;
		// console.log(JSON.parse(isEdit));
		$scope.touchSave = _touchSave;
		$scope.touchSetDefault = _touchSetDefault;
		$scope.touchPickerShow = _touchPickerShow;
		$scope.touchPickerRegion = _touchPickerRegion;
		$scope.touchPickerCancel = _touchPickerCancel;
//		$scope.formatRegions = _formatRegions;
		$scope.touchDelete = _touchDelete;
		$scope.touchCancel = _touchCancel;

		$scope.showPicker = false;
		$scope.pickerData = [];
		$scope.pickerRegions = [];
		$scope.datas={};

		$scope.ADDRESS = {

        }
		if (!isEdit||isEdit==undefined){
            $scope.addAddress = true;
		} else {
            $scope.addAddress = false;
		}
		if(isEdit!=null||isEdit!=undefined){
			$scope.datas.consignee = JSON.parse(isEdit).consignee;
			$scope.datas.mobilePhone = JSON.parse(isEdit).mobilePhone;
			$scope.datas.sraId = JSON.parse(isEdit).sraId;              //设置默认地址用
			$scope.datas.isDefault = JSON.parse(isEdit).isDefault;
			$scope.datas.address = JSON.parse(isEdit).address;  //详细地址
            $scope.datas.sraId = JSON.parse(isEdit).sraId;      //用来删除地址
            $scope.datas.pickerRegionName = JSON.parse(isEdit).provinceName+JSON.parse(isEdit).cityName+JSON.parse(isEdit).areaName+JSON.parse(isEdit).streetName+JSON.parse(isEdit).countryName;
            $scope.datas.countryId = JSON.parse(isEdit).countryId;
            //用来显示已有的地址级别
            $scope.ADDRESS.provinceId = JSON.parse(isEdit).provinceId;
            $scope.ADDRESS.cityId = JSON.parse(isEdit).cityId;
            $scope.ADDRESS.areaId = JSON.parse(isEdit).areaId;
            $scope.ADDRESS.streetId = JSON.parse(isEdit).streetId;
            $scope.ADDRESS.countryId = JSON.parse(isEdit).countryId;
            $scope.ADDRESS = JSON.parse(isEdit);

		}else{
		    console.log("?")
			$scope.datas.consignee = null;
			$scope.datas.mobilePhone = null;
         	$scope.datas.address = null;
            $scope.datas.countryId = null;      //省市区最后级别的Id
            $scope.datas.isDefault = 0;
            $scope.datas.pickerRegionName = null;     //显示最终选择的地区
            $scope.proSNAME = null;
            $scope.citySNAME = null;
            $scope.areaSNAME = null;
            $scope.townSNAME = null;
            $scope.streeSNAME = null;

		}

		$scope.addressEditModel = AddressEditModel;

		var consignee = $scope.addressEditModel.consignee;
		if (consignee && consignee.id) {
			$scope.name = consignee.name;
			$scope.mobilePhone = consignee.mobilePhone;
			$scope.regions = consignee.regions;
			$scope.address = consignee.address;
			$scope.isDefault = consignee.is_default;
		}

		function _touchCancel(){
			$scope.goBack();
		}

		function _touchSave() {
		    var changeUrl;
		    if (isEdit!=null&&isEdit!=undefined){
                changeUrl = "/storesInfo/updateStoresReceivingAddress"
            }else {
                changeUrl="/storesInfo/addStoresReceivingAddress"
            }

			var name = $scope.datas.consignee;
			var mobilePhone = $scope.datas.mobilePhone;
			var address = $scope.datas.address;

			var countryId = $scope.datas.countryId;

			var isDefault = $scope.datas.isDefault;
			if (!name || name.length < 2) {
				$scope.toast('请输入姓名');
				return;
			}

			if (!mobilePhone || mobilePhone.length < 5 ||!(/^1[34578]\d{9}$/.test(mobilePhone))) {
				$scope.toast('请输入正确的手机号');
				return;
			}

			if (!countryId){
				$scope.toast("请选择所在地区");
                return;
			}

			if (!address || address.length < 1) {
				$scope.toast('请输入详细地址');
				return;
			}
			console.log($scope.datas);
		    var sendData={
	            "data": $scope.datas
	        };
		    $.ajax({
		        type: "post",
		        url: changeUrl,
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success : function(data){  
		          if(data.errorInfo==null){
		        	    $scope.toast("操作成功。")
                        $scope.goBack();
		        	    $scope.$apply();
		          }else{
                      $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   $scope.toast("服务器异常");
		        }
		     });

		}

		function _touchSetDefault(datas) {

            if (!datas.sraId){
                $scope.datas.isDefault = 1;
                $scope.toast("设为默认地址")
                return;
			}
		    var sendData={
	            "data": {
	                "sraId" : datas.sraId,
	                "isDefault": "1"
	            }
	        };
		    $.ajax({
		        type: "post",
		        url: "/storesInfo/updateDefaultAddress",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	 $scope.toast("操作成功");
		        	 $scope.datas.isDefault=1;
		        	 $scope.$apply();
		          }else{
                      $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
                    $scope.toast("服务器异常")
		        }
		     });
		}

		function _touchDelete(datas){
		    var sendData={
	            "data": {
	                "sraId" : datas.sraId,
	            }
	        };
		    $.ajax({
		        type: "post",
		        url: "/storesInfo/deleteStoresReceivingAddress",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){  
		          if(data.errorInfo==null){
		        	 $scope.toast("删除成功")
		        	 $scope.goBack();
		          }else{
                   $scope.toast(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
		}

        /**
		 *	开始走地区选择逻辑
         */

		$scope.getProvince=function(){
		    var sendData={
	            "data": {}
	        };
		    $.ajax({
		        type: "post",
		        url: "/user/getAllProvince/",
		        contentType:'application/json',
		        data: JSON.stringify(sendData),
		        dataType : "json",
		        success: function(data){
		          if(data.errorInfo==null){

		        	 $scope.provinceList=data.data.provinces;
		        	 $scope.$apply();
		          }else{
                      console.log(data.errorInfo);
		          }
		        },
		        error:function(info){
		     	   console.log(info);
		        }
		     });
		};
		$scope.getProvince();

		function _touchPickerRegion(region,idx) {

		}

		function _touchPickerCancel() {
			$scope.showPicker = false;
			$scope.pickerData = [];
			$scope.pickerRegions = [];
			$scope.pickerRegionName = null;
		}

        /**
		 * 新的地区选择逻辑
         */


        /**
         * 对选中的样式进行控制
         */
        $scope.loading = false;
        $scope.hasPro=true;
        $scope.hasCity=false;
        $scope.hasArea=false;
        $scope.hasTown=false;
        $scope.hasStree=false;
        /**
		 * 请选择的出现于隐藏
         * @type {boolean}
         */

        $scope.hasSECity=false;
        $scope.hasSEArea=false;
        $scope.hasSETown=false;
        $scope.hasSEStree=false;

        $scope.active = -1;		//省份选择变色
        $scope.activeCity = -1;//城市点击变色
        $scope.activeArea = -1;//区域点击变色
        $scope.activeStree = -1;//乡镇点击变色
        $scope.activeCountry = -1;//街道点击变色

        $scope.provice = _provice;
        $scope.city = _city;
        $scope.area= _area;
        $scope.town= _town;
        $scope.stree= _stree;
        $scope.selectPro = _selectPro;	//选择省份
		$scope.selectCity = _selectCity;//选择城市
        $scope.selectArea = _selectArea;//选择地区
        $scope.selectTown = _selectTown;//选择城镇
        $scope.selectCountry = _selectCountry;//选择街道
        /**
		 * 出来吧选择器！
         * @private
         */
        $scope.isDisappear = false;
        function _touchPickerShow(){
            $scope.isDisappear = true;
            // $("#addressFixed").css({"display":"block"});
            if (isEdit==null||isEdit==undefined){


            }else {
                var PARAMS = JSON.parse(isEdit)
                console.log(PARAMS);

                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName
                _selectPro(PARAMS.provinceName,PARAMS.provinceId,null);
                _selectCity(PARAMS.cityName,PARAMS.cityId,null);
                _selectArea(PARAMS.areaName,PARAMS.areaId,null);
                _selectTown(PARAMS.streetName,PARAMS.streetId,null);


            }
        }

		$scope.reLoad = function () {
            // $("#addressFixed").hide();

            if (isEdit==null||isEdit==undefined){


            }else {
                var PARAMS = JSON.parse(isEdit)
                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName

            }
            $scope.isDisappear = false;
        }

        function _provice(){
            $("#address-info").animate({"margin-left":"0%"},300);
            // $(".provice").addClass("address-now");
            $scope.hasPro=true;
            $scope.hasCity=false;
            $scope.hasArea=false;
            $scope.hasTown=false;
            $scope.hasStree=false;
            $(".provice").siblings().removeClass("address-now");
        }
        function _city(){
            $("#address-info").animate({"margin-left":"-100%"},300);
            // $(".city").addClass("address-now");
            $scope.hasCity=true;
            $scope.hasArea=false;
            $scope.hasTown=false;
            $scope.hasStree=false;
            $(".city").siblings().removeClass("address-now");
        }
        function _area(){
            $("#address-info").animate({"margin-left":"-200%"},300);
            // $(".area").addClass("address-now");
            $scope.hasCity=false;
            $scope.hasArea=true;
            $scope.hasTown=false;
            $scope.hasStree=false;
            $(".area").siblings().removeClass("address-now");
        }
        function _town(){
            $("#address-info").animate({"margin-left":"-300%"},300);
            // $(".town").addClass("address-now");
            $scope.hasCity=false;
            $scope.hasArea=false;
            $scope.hasTown=true;
            $scope.hasStree=false;
            $(".town").siblings().removeClass("address-now");
        }
        function _stree(){
            $("#address-info").animate({"margin-left":"-400%"},300);
            // $(".stree").addClass("address-now");
            $scope.hasCity=false;
            $scope.hasArea=false;
            $scope.hasTown=false;
            $scope.hasStree=true;
            $(".stree").siblings().removeClass("address-now");
        }


        /**
		 * 选择省份
         * @param pro
         * @param provinceId
         * @private
         */
		function _selectPro(provinceName,provinceId,isClick) {
            $scope.loading = true;

            $scope.hasPro=false;
            $scope.hasCity=true;
            $scope.hasArea=false;
            $scope.hasTown=false;
            $scope.hasStree=false;

            $scope.hasSECity=true;
            $scope.hasSEArea=false;
            $scope.hasSETown=false;
            $scope.hasSEStree=false;
            if (isEdit==null||isEdit==undefined||isClick!=null){
                $scope.citySNAME = null;
                $scope.areaSNAME = null;
                $scope.townSNAME = null;
                $scope.streeSNAME =null;


                $scope.activeCity = -1;//城市点击变色
                $scope.activeArea = -1;//区域点击变色
                $scope.activeStree = -1;//乡镇点击变色
                $scope.activeCountry = -1;//街道点击变色


            }else {
                var PARAMS = JSON.parse(isEdit)
                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName

            }


            $scope.active = provinceId;
            // $(".provice").text(provinceName);
            $scope.proSNAME = provinceName;

            $("#address-info").animate({"margin-left":"-100%"});
            var sendData={
                "data": {
                    "provinceId": provinceId
                }
            };
            $.ajax({
                type: "post",
                url: "/user/getCityByProvinceId/",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
                        $scope.loading = false;
                        $scope.cityList=data.data.citys;
                        $scope.$apply();
                    }else{
                        console.log(data.errorInfo);
                    }
                },
                error:function(info){
                    console.log(info);
                }
            });
        }

        /**
		 * 点击城市获取区域	areaList
         * @param city
         * @param cityId
         * @private
         */
        function _selectCity(cityName,cityId,isClick) {
            $scope.loading = true;
            $scope.hasPro=false;
            $scope.hasCity=false;
            $scope.hasArea=true;
            $scope.hasTown=false;
            $scope.hasStree=false;

            $scope.hasSECity=true;
            $scope.hasSEArea=true;
            $scope.hasSETown=false;
            $scope.hasSEStree=false;



            if (isEdit==null||isEdit==undefined ||isClick!=null){
                $scope.areaSNAME = null;
                $scope.townSNAME = null;
                $scope.streeSNAME =null;

                $scope.activeArea = -1;//区域点击变色
                $scope.activeStree = -1;//乡镇点击变色
                $scope.activeCountry = -1;//街道点击变色

            }else {
                var PARAMS = JSON.parse(isEdit)
                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName

            }
            // $(".city").text(cityName);
            $scope.citySNAME = cityName;

            $scope.activeCity = cityId;
            $("#address-info").animate({"margin-left":"-200%"});

            var sendData={
                "data": {
                    "cityId": cityId
                }
            };
            $.ajax({
                type: "post",
                url: "/user/getAreaByCityId/",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
                        $scope.areaList=data.data.areas;
                        $scope.loading = false;
                        $scope.$apply();
                    }else{
                        console.log(data.errorInfo);
                    }
                },
                error:function(info){
                    console.log(info);
                }
            });
        }
		
        function _selectArea(areaName,areaId,isClick) {
            $scope.loading = true;
            $scope.hasPro=false;
            $scope.hasCity=false;
            $scope.hasArea=false;
            $scope.hasTown=true;
            $scope.hasStree=false;

            $scope.hasSECity=true;
            $scope.hasSEArea=true;
            $scope.hasSETown=true;
            $scope.hasSEStree=false;
            $scope.activeArea = areaId;//区域点击变色


            if (isEdit==null||isEdit==undefined ||isClick!=null){
                $scope.townSNAME = null;
                $scope.streeSNAME =null;

                $scope.activeStree = -1;//乡镇点击变色
                $scope.activeCountry = -1;//街道点击变色

            }else {
                var PARAMS = JSON.parse(isEdit)
                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName

            }
            $("#address-info").animate({"margin-left":"-300%"});
            // $(".area").text(areaName);

            $scope.areaSNAME = areaName;

            var sendData={
                "data": {
                    "areaId": areaId
                }
            };
            $.ajax({
                type: "post",
                url: "/storesInfo/getStreetList",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
                        $scope.loading = false;
                        $scope.streetList=data.data.streetList;
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

        function _selectTown(stName,streetId,isClick) {
            $scope.loading = true;

            $scope.hasPro=false;
            $scope.hasCity=false;
            $scope.hasArea=false;
            $scope.hasTown=false;
            $scope.hasStree=true;

            $scope.hasSECity=true;
            $scope.hasSEArea=true;
            $scope.hasSETown=true;
            $scope.hasSEStree=true;

            $scope.activeStree = streetId;//乡镇点击变色

            $("#address-info").animate({"margin-left":"-400%"});
            // $(".town").text(stName);
            $scope.townSNAME = stName;



            if (isEdit==null||isEdit==undefined ||isClick!=null){
                $scope.streeSNAME =null;

                $scope.activeCountry = -1;//街道点击变色

            }else {
                var PARAMS = JSON.parse(isEdit)
                $scope.proSNAME = PARAMS.provinceName;
                $scope.citySNAME = PARAMS.cityName;
                $scope.areaSNAME = PARAMS.areaName;
                $scope.townSNAME = PARAMS.streetName;
                $scope.streeSNAME = PARAMS.countryName

            }

            var sendData={
                "data": {
                    "streetId": streetId
                }
            };
            $.ajax({
                type: "post",
                url: "/storesInfo/getCountryList",
                contentType:'application/json',
                data: JSON.stringify(sendData),
                dataType : "json",
                success: function(data){
                    if(data.errorInfo==null){
                        $scope.loading = false;
                        $scope.countryList=data.data.countryList;
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
        function _selectCountry(countryName,countryId) {

            // $(".stree").text(countryName);
            $scope.streeSNAME = countryName
            console.log(countryId,"countryId")
            $scope.datas.countryId = countryId;
            $scope.streeSNAME = countryName;
            // $scope.pickerRegionName = $(".provice").text()+$(".city").text()+$(".area").text()+$(".twon").text()+$(".stree").text()
            $scope.datas.pickerRegionName = $scope.proSNAME + $scope.citySNAME +$scope.areaSNAME + $scope.townSNAME + $scope.streeSNAME;
            console.log( $scope.datas.pickerRegionName);
            $scope.isDisappear = false;

        }

	}

})();