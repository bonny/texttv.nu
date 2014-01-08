
var texttvApp = angular.module('texttvApp', ['ionic', 'ngAnimate', 'ngRoute']);
texttvApp.run();

texttvApp.config(function ($compileProvider){
	// Needed for phonegap routing
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});


texttvApp.config(function($routeProvider, $locationProvider) {
		
	$routeProvider.when('/sida/:pageRange', {
		action: "loadPageRange"
	});
	
	// Start of app / website
	$routeProvider.otherwise({
		redirectTo: '/start',
		//templateUrl: 'partials/home.html',
		//controller: 'StartCtrl'
		action: "loadPageRange"
	});

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

texttvApp.controller('TexttvCtrl', function($scope, $route, $routeParams) {

	console.log("Start TexttvCtrl");

	$scope.headerbar = {
		title: "<img src='img/logo.png' alt=' height=15> TextTV.nu",
		titleTest: null,
		showBackButton: 0
	};

	$scope.test = {
		title: "Title i test objekt"
	};

	// Listen for changes to the Route. When the route
	// changes, let's set the renderAction model value so
	// that it can render in the Strong element.
	// http://www.bennadel.com/blog/2420-Mapping-AngularJS-Routes-Onto-URL-Parameters-And-Client-Side-Events.htm
	$scope.$on(
		"$routeChangeSuccess",
		function( $currentRoute, $previousRoute ){

			var action = $route.current.action;
			var pageRange = $routeParams.pageRange;

			if (action == "loadPageRange") {

				console.log("Load load load!", $routeParams);

				$.getJSON("http://texttv.nu/api/get/" + pageRange, function(page) {
				
					var newSlide;
					//var newSlide = mySwiper.createSlide( "Prev" );
					//newSlide.append();

					newSlide = mySwiper.createSlide(page[0].content[0]);
					newSlide.append();

					//newSlide = mySwiper.createSlide( "Next" );
					//newSlide.append();

					//mySwiper.swipeTo(1);

				});


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

/*
texttvApp.config(['$routeProvider',
  function($routeProvider) {
	$routeProvider.
	  when('/phones', {
		templateUrl: 'partials/list.html',
		controller: 'PhoneListCtrl'
	  }).
	  otherwise({
		redirectTo: '/phones'
	  });
  }]);
*/


// Activate slider onDomReady
var mySwiper;
$(function($) {

	var $document = $(document);
	
	// Listen for clicks in root area
	$document.on("click", ".root a", function(e) {

		var $this = $(this);
		var pageRange = $this.attr("href");
		
		// Get scope
		var $scope = angular.element( this ).scope(); // .info('me')

		// and close any open sidebar
		$scope.sideMenuController.close();

		// Go to new url
		document.location = "#/sida" + pageRange;

		e.preventDefault();

	});

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

  

}, false);
