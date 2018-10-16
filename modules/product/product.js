(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('product', {
				url: '/product/?product',
				cache:false,
				title: "商品详情",
				templateUrl: 'modules/product/product.html',
			});

	}

})();