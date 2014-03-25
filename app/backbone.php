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
	<script src="bower_components/underscore.string/lib/underscore.string.js"></script>
	<script src="bower_components/backbone/backbone.js"></script>
	<script src="bower_components/fastclick/lib/fastclick.js"></script>
	<script src="bower_components/swiper/dist/idangerous.swiper-2.4.js"></script>
	<script src="js/lawnchair-0.6.1.min.js"></script>

</head>

<body>

	<div id="MainView" class="view view--main"></div>

	<!-- Template for most visited pages in sidebar -->
	<script id="MostVisitedTemplate" type="text/html">
		
		<% if (pages.length) { %>

			<div class="item item-divider">Dina mest besökta</div>

			<div class="MostVisitedPagesItems">
				<% _.each(pages, function(page) { %>  
					<a class="item item-texttvpage" href="" data-pagerange="<%= page.pageRange %>">
						<%= page.pageRange %>
						<span class="item-note"><%= page.count %></span>
					</a>
				<% }); %>
			</div>

		<% } %>
		
	</script>

	<!-- Placeholder template for next page (and "prev") -->
	<script id="NextPageTemplate" type="text/html">
		<div class="placeholderPage placeholderPage--next">
			<div class="placeholderPage-icon ion-document-text"></div>
			<div class="placeholderPage-text">
				<p class="placeholderPage-pageRange"><%= obj.nextPageRange %></p>
				<!-- <p>Släpp för att ladda</p> -->
			</div>
		</div>
	</script>

	<script id="PrevPageTemplate" type="text/html">
		<div class="placeholderPage placeholderPage--prev">
			<div class="placeholderPage-icon ion-document-text"></div>
			<div class="placeholderPage-text">
				<p class="placeholderPage-pageRange"><%= obj.prevPageRange %></p>
				<!-- <p>Släpp för att ladda</p> -->
			</div>
		</div>
	</script>
	
	<!-- "Loading page..." -template -->
	<script id="LoadingPageTemplate" type="text/html">
		<div class="pageIsLoading">
			<div class="pageIsLoading-spinnerIcon ion-loading-c"></div>
			<p class="pageIsLoading-text"><%= pageRange %></p>
		</div>
	</script>

	<!-- Failed to load page -->
	<script id="LoadingPageTemplateFailed" type="text/html">
		<div class="pageIsLoading pageIsLoading--failed">
			<div class="pageIsLoading-failIcon ion-alert-circled"></div>
			<p class="pageIsLoading-text"><%= pageRange %></p>
			<p class="pageIsLoading-text">Kunde inte läsa in sidan.<br>Försök igen om en stund.</p>
		</div>
	</script>

	<!-- Texttv-page-template -->
	<script id="TextTVPageTemplate" type="text/html">
		
		<!-- Foreach page, output it's contents -->
		<% 
		_.each(sourceData, function(page) { %>
			<% _.each(page.content, function(pageContents) { %>
				<%= pageContents %>
			<% }) %>
		<% }) %>
		
		<!-- <p>Hej Hopp svejs<br>hejs<br>före</p> -->
		
		<div class="list card list--share">

			<div class="item item-text">

				<div class="button-bar">

					<a class="button js-reloadPage">
						<i class="icon ion-ios7-reload"></i>
						Ladda om
					</a>

					<a class="button js-sharePage">
						<i class="icon ion-ios7-upload-outline"></i>
						Dela
					</a>

				</div>

			</div>

			<!-- <p>Hej Hopp svejs<br>hejs<br>efter</p> -->

			<!--
			<div class="item item-divider">
				<h2>Debuginfo</h2>
			</div>

			<div class="item item-text">
				
				<ul class="list">
					<li class="item ng-binding">
						pageRange:
						100
					</li>

					<li class="item ng-binding">
						time:
						"2014-03-07T19:34:12.299Z"
					</li>

					<li class="item ng-binding">
						parent:
						
					</li>
				</ul>

			</div>
			-->

		</div>
	</script>
	
	<!-- Bar template, with back-button and texttv.nu logo -->
	<script id="MainViewBarTemplate" type="text/x-template">
	
		<div class="bar bar-header bar-positive">

			<% if (hasPrevPage) { %>
				<button class="button button-clear">
					<i class="icon ion-ios7-arrow-back"></i>
					Tillbaka
				</button>
			<% } %>

			<h1 class="title">
				<a href="/100" class="bar-header-titleLink">
					<% if (title == "TextTV.nu") { %>
						<img src="img/logo.png" alt="'" height="15">
					<% } %>
					<%- title %>
				</a>
			</h1>

			<button class="button button-clear icon ion-navicon js-sidebarToggle"></button>

		</div>
	
	</script>

	<!-- Main page template, including divs for swiper -->
	<script id="MainViewTemplate" type="text/x-template">
		
		<div id="MainViewBar"></div>

		<div class="content has-header">
			
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

				<div class="item item-divider">Gå till sida</div>
				<label class="item item-input">
					<i class="icon ion-document placeholder-icon"></i>
					<input class="sidebar-input-page" type="number" pattern="\d*" placeholder="Skriv in sida att gå till">
				</label>
				
				<!--		
				<div class="item item-input-inset">
					<label class="item-input-wrapper">
						<i class="icon ion-document placeholder-icon"></i>
						<input class="sidebar-input-page" type="number" pattern="\d*" placeholder="Gå till sida">
					</label>
				</div>
				-->
				
				<div id="SidebarMostVisisted"></div>

				<div class="item item-divider">Sidor</div>
				<a class="item item-texttvpage" href="" data-pagerange="100">Start <span class="item-note">100</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="100-105">Nyheter <span class="item-note">100-105</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="101-102">Inrikes <span class="item-note">101-102</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="104-105">Urikes <span class="item-note">104-105</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="200">Ekonomi <span class="item-note">200</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="300-301">Sport <span class="item-note">300-301</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="376">Sportresultat <span class="item-note">377</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="571">Sportresultat, V75 <span class="item-note">571</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="400">Väder <span class="item-note">400</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="500">Blandat <span class="item-note">500</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="600">På TV <span class="item-note">600</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="700">Innehåll <span class="item-note">700</span></a>
				<a class="item item-texttvpage" href="" data-pagerange="800">UR <span class="item-note">800</span></a>

			</div>

		</div>

	</div>

	<script src="texttv.backbone.app.js"></script>

</body>
</html>