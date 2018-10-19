(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('search-result', {
				needAuth: false,
				url: '/search-result/?catId?catName?orderId?isSearch?tagId?tagName',
				title: "搜索结果",
				templateUrl: 'modules/search-result/search-result.html',
			});

	}

})();