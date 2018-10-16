(function () {

	'use strict';

	angular
		.module('app')
		.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('index', {
				url: '?token',
                cache:true,
				title: "首页",
				templateUrl: 'modules/home/home.html'
			});


		$stateProvider
			.state('home', {
				url: '/home',
				cache:true,
				title: "首页",
				templateUrl: 'modules/home/home.html',
			});

	}

})();