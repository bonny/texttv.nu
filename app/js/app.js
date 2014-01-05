
angular.module('texttv', ['ionic'])
.controller('TexttvCtrl', function($scope) {

  $scope.tasks = [
		{ title: 'Collect coins' },
		{ title: 'Eat mushrooms' },
		{ title: 'Get high enough to grab the flag' },
		{ title: 'Find the Princess' }
	];

	/*
      Sport, Resultat377
      Sport, Resultat V75571
      Leifbys text-tv-favoriter
      1) Målservice 377
      2) Skytteligor (fotboll) 351
      3) Tipset i sista stund 327
      4) Resultat/Tabellbörsen 330
      5) Tipset 551
      Dela på Twitter
      Dela på Facebook
      Permalänk
      Blogg Om TextTV.nu
      Ladda hem vår app
      för Iphone/Ipad

	*/

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
