<!DOCTYPE html>
<!--[if IEMobile 7 ]>    <html class="no-js iem7"> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<title>TextTV.nu backbone version</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">

	<link rel="stylesheet" href="bower_components/ionic/release/css/ionic.css">
	<link rel="stylesheet" href="bower_components/swiper/dist/idangerous.swiper.css">
	<link rel="stylesheet" href="css/texttv-theme-black.css">
	<link rel="stylesheet" href="bower_components/animate.css/animate.css">

	<script src="bower_components/jquery/jquery.js"></script>
	<script src="bower_components/underscore/underscore.js"></script>
	<script src="bower_components/backbone/backbone.js"></script>
	<script src="bower_components/fastclick/lib/fastclick.js"></script>
	<script src="bower_components/swiper/dist/idangerous.swiper-2.4.js"></script>

</head>

<body>

	<div id="MainView" class="view view--main"></div>
	
	<script id="MainViewTemplate" type="text/x-template">
	
		<div class="bar bar-header bar-positive">

			<% if (hasPrevPage) { %>
				<button class="button button-clear">
					<i class="icon ion-ios7-arrow-back"></i>
					Tillbaka
				</button>
			<% } %>

			<h1 class="title">
				<% if (title == "TextTV.nu") { %>
					<img src="img/logo.png" alt="'" height="15">
				<% } %>
				<%- title %>
			</h1>

			<button class="button button-clear icon ion-navicon js-sidebarToggle"></button>

		</div>

		<div class="content has-header">
			
			<p>texttv-sidor kommer här dårå</p>

			<div class="swiper-container">
				<div class="swiper-wrapper">
				</div>
			</div>

		</div>

	</script>

	<div id="SidebarRight" class="menu menu-right">

		<header class="bar bar-header bar-dark">
			<h1 class="title">Sidor</h1>
			<button class="button button-clear ion-close-circled js-sidebarToggle"></button>
		</header>

		<div class="scroll-content has-header" scroll="true" overflow-scroll="false" has-header="true">
			
			<div class="list list--pages">
				<a class="item" href="" data-pagerange="100">Start <span class="item-note">100</span></a>
				<a class="item" href="" data-pagerange="100-105">Nyheter <span class="item-note">100-105</span></a>
				<a class="item" href="" data-pagerange="101-102">Inrikes <span class="item-note">101-102</span></a>
				<a class="item" href="" data-pagerange="104-105">Urikes <span class="item-note">104-105</span></a>
				<a class="item" href="" data-pagerange="200">Ekonomi <span class="item-note">200</span></a>
				<a class="item" href="" data-pagerange="300-301">Sport <span class="item-note">300-301</span></a>
				<a class="item" href="" data-pagerange="377">Sportresultat <span class="item-note">377</span></a>
				<a class="item" href="" data-pagerange="571">Sportresultat, V75 <span class="item-note">571</span></a>
				<a class="item" href="" data-pagerange="400">Väder <span class="item-note">400</span></a>
				<a class="item" href="" data-pagerange="500">Blandat <span class="item-note">500</span></a>
				<a class="item" href="" data-pagerange="600">På TV <span class="item-note">600</span></a>
				<a class="item" href="" data-pagerange="700">Innehåll <span class="item-note">700</span></a>
				<a class="item" href="" data-pagerange="800">UR <span class="item-note">800</span></a>
			</div>

		</div>

	</div>

	<style>
		#MainView {
			-webkit-transition: all .15s ease-in-out;
		}
		#MainView.open-sidebar {
			-webkit-transform: translateX(-275px);
		}
		.menu .scroll-content {
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch;
		}
		.content {
			height: 100%;
		}
		.swiper-container {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			overflow: hidden;
		}
		.swiper-slide {
			width: 100%;
			height: 100%;
			overflow: hidden;
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch;
		}

	</style>

	<script src="texttv.backbone.app.js"></script>

</body>
</html>