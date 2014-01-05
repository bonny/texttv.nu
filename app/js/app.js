
angular.module('texttv', ['ionic'])

.config(function ($compileProvider){
	// Needed for phonegap routing
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.config(function($routeProvider, $locationProvider) {
	
	console.log("Init routeconfig");
	
	$routeProvider.otherwise({
		redirectTo: '/home'
	});

})

.controller('TexttvCtrl', function($scope) {

	$scope.leftButtons = [
		{ 
			type: 'button-clear',
			content: '<i class="icon ion-ios7-arrow-back"></i> Tillbaka',
			tap: function(e) {
				console.log("Click back button");
			}
		}
	];

	$scope.rightButtons = [
		{ 
			type: 'button-clear',
			content: '<i class="icon ion-navicon-round"></i>',
			tap: function(e) {
				console.log("Click menu button");
				$scope.toggleMenu();
			}
		}
	];

	$scope.onRefresh = function() {
		
		console.log("Do refresh");
		
		// Fake refresh for now
		setTimeout(function() {
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);

		/*
		Before drag:
		scroll-refresher ng-scope
		
		Under tiden synlig/redo
		scroll-refresher ng-scope active

		Under tider refreshing
		scroll-refresher ng-scope active refreshing
		*/

	};

	$scope.startPages = {
		firstRow: [
			{ title: "Nyheter", range: "100" },
			{ title: "Ekonomi", range: "200" },
			{ title: "Sport", range: "300" },
			{ title: "Väder", range: "400" }
		],
		secondRow: [
			{ title: "Blandat", range: "500" },
			{ title: "På TV", range: "600" },
			{ title: "Innehåll", range: "700" },
			{ title: "UR", range: "800" }
		]
	};

	$scope.sidebar = {
		pages: [
			{ title: "Start", range: "100" },
			{ title: "Nyheter", range: "100-105" },
			{ title: "Inrikes", range: "101-102" },
			{ title: "Utrikes", range: "104-105" },
			{ title: "Ekonomi", range: "200" },
			{ title: "Sport", range: "300-301" },
			{ title: "Sportresultat", range: "377" },
			{ title: "Sportresultat, V75", range: "571" },
			{ title: "Väder", range: "400" },
			{ title: "Blandat", range: "500" },
			{ title: "På TV", range: "600" },
			{ title: "Innehåll", range: "700" },
			{ title: "UR", range: "800" }
		]
	};

	/**
	 * Show right sidebar
	 */
	$scope.toggleMenu = function() {
		$scope.sideMenuController.toggleRight();
	};

});

var mySwiper;
$(function($) {

  mySwiper = new Swiper('.swiper-container',{
	//Your options here:
	mode: 'horizontal',
	resistance: true,
	useCSS3Transforms: true,
	/*onSlideChangeStart: function(swiper) {
	  console.log("onSlideChangeStart");
	},
	onSlideChangeEnd: function(swiper) {
	  console.log("onSlideChangeEnd");
	},
	onMomentumBounce: function() {
		console.log("onMomentumBounce");
	},
	onResistanceBefore: function() {
		console.log("onResistanceBefore");
	},
	onResistanceAfter: function() {
		console.log("onResistanceAfter");
	},
	onSetWrapperTransition: function(swiper, duration) {
		console.log("onSetWrapperTransition", duration);	
	},
	onSetWrapperTransform: function (swiper, transform) {
		console.log("onSetWrapperTransform", transform);
	}*/
  });

  $.getJSON("http://texttv.nu/api/get/100", function(page) {

	// console.log(page);
	// console.log(mySwiper);
	
	var newSlide = mySwiper.createSlide( "Prev" );
	newSlide.append();

	newSlide = mySwiper.createSlide(page[0].content[0]);
	newSlide.append();

	newSlide = mySwiper.createSlide( "Next" );
	newSlide.append();

	mySwiper.swipeTo(1);

  });

}, false);
