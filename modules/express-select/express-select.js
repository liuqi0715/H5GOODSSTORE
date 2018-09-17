(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('express-select', {
				needAuth: true,
				cache:true,
				url: '/express-select?keptData?addrData?addressId?shopId',
				title: "配送方式",
				templateUrl: 'modules/express-select/express-select.html',
			});
	}

})();