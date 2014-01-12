
var texttvApp = angular.module('texttvApp', ['ionic', 'ngAnimate', 'ngRoute', 'ngAnimate-animate.css']);
//texttvApp.run();

texttvApp.config(function ($compileProvider){
	// Needed for phonegap routing
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});


texttvApp.config(function($routeProvider, $locationProvider) {
		
	$routeProvider.when('/sida/:pageRange', {
		action: "loadPageRange"
	});

	$routeProvider.when('/home', {
		action: "loadHome"
	});
	
	// Start of app / website
	$routeProvider.otherwise({
		redirectTo: '/home',
		//templateUrl: 'partials/home.html',
		//controller: 'StartCtrl'
		action: "otherwise"
	});

});

/**
 * Create directive that loads and shows a div with a texttv-page
 *
 * Example:
 *  <texttvpage pageRange="100-110"></texttvpage>
 */
texttvApp.directive('texttvPage', function() {

	console.log("Init directive");

	return {
		restrict: 'E',
		templateUrl: 'partials/texttv-page.html',
		scope: {
			pageRange: "="
		},
		controller: function($scope, $http, $timeout) {

			// $scope here is for this template only
			console.log("texttvPage directive controller");
			$scope.myVar = {
				time: new Date()
			};

			// $scope.$parent.headerbar.title = "apa";
			$scope.$parent.headerbar.showBackButton = true;
			
			// Render template for current page range
			// Load page and then updates automatically when we get data
			var url = $scope.$parent.api.base + "get/" + $scope.pageRange;
			$http.get(url).success(function(data, status, headers, config) {

				// Fake a small delay to test spinning wheel/loading look and feeling
				//*
				$timeout(function() {
					
					$scope.pages = data;

				}, 0);
				// */


				//mySwiper.reInit();
				//mySwiper.resizeFix(); // call this function after you change Swiper's size without resizing of window.

			});

		},
		link: function(scope, iElement, iAttrs, controller, transcludeFn) {

			//console.log("scope", scope.$parent.api);

		}
	};

});

/**
 * Start of app / website
 */
texttvApp.controller('StartCtrl', function($scope) {
	console.log( "StartCtrl" );
	//alert($scope.headerTitle);
	$scope.headerbar.title = "YO!";
	$scope.leftButtons = "yoyoyo";
	$scope.test = "hejsan hoppsan";
	$scope.headerbar.titleTest = "";
});

texttvApp.controller('TexttvCtrl', function($scope, $route, $routeParams, $compile) {

	console.log("Init TexttvCtrl");

	$scope.headerbar = {
		title: "<img src='img/logo.png' alt=' height=15> TextTV.nu",
		titleTest: null,
		showBackButton: 0
	};

	$scope.api = {
		base: "http://texttv.nu/api/"
	};

	$scope.setupSwiper = function() {

		// make this better, look at this:
		// http://stackoverflow.com/questions/16286605/initialize-angularjs-service-with-asynchronous-data
		// http://stackoverflow.com/questions/18646756/how-to-run-function-in-angular-controller-on-document-ready
		$scope.swiper = new Swiper('.swiper-container',{
			//Your options here:
			mode: 'horizontal',
			resistance: true,
			useCSS3Transforms: true,
			xcalculateHeight: true,
			xcssWidthAndHeight: true
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

	};

	// Setup swiper on dom ready
	angular.element(document).ready(function() {

		$scope.setupSwiper();

	});

	// Listen for changes to the Route. When the route
	// changes, let's set the renderAction model value so
	// that it can render in the Strong element.
	// http://www.bennadel.com/blog/2420-Mapping-AngularJS-Routes-Onto-URL-Parameters-And-Client-Side-Events.htm
	$scope.$on(
		"$routeChangeSuccess",
		function( $currentRoute, $previousRoute ){

			console.log("on routeChangeSuccess");

			// Close any open side menu
			$scope.sideMenuController.close();

			var action = $route.current.action;
			var pageRange = $routeParams.pageRange;
			
			if (action == "loadHome") {
				
				console.log("loadHome");
				$scope.headerbar.showBackButton = false;

			} else if (action == "loadPageRange") {

				console.log("Load pageRange!", pageRange);

				// Render texttv page using our own directive
				// This directive loads the page via the api
				var includetag = angular.element("<texttv-page page-range=\"'" + pageRange + "'\"></texttv-page>");
				var el = $compile( includetag )( $scope.$new() );

				// Create and append new empty slide
				var newSlide = $scope.swiper.createSlide( "" );
				newSlide.append();

				// Append template to slide
				var lastSlide = $( $scope.swiper.getLastSlide() );
				lastSlide.append( el );

				//mySwiper.swipeTo(01);

			}

		}
	);

	// Prev, current, and next texttv pages
	$scope.pages = {
		prev: null,
		current: null,
		next: null
	};

	//*
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
				$scope.toggleMenu();
			}
		}
	];
	// */

	/**
	 * When pull-to-refresh is activated
	 */
	$scope.onRefresh = function() {
		
		console.log("Do refresh");
		
		// Fake refresh for now
		// Call this to let refresher that we are done
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

}); // end TexttvCtrl


// Activate slider onDomReady
/*
$(function($) {

	var $document = $(document);
	
	// Listen for clicks in root area
	$document.on("click", ".root a", function(e) {

		var $this = $(this);
		var pageRange = $this.attr("href");
		
		// Get scope
		//var $scope = angular.element( this ).scope(); // .info('me')

		// and close any open sidebar
		//$scope.sideMenuController.close();

		// Go to new url
		document.location = "#/sida" + pageRange;

		e.preventDefault();

	});


  

}, false);
*/