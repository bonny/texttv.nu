<!DOCTYPE html>
<!--[if IEMobile 7 ]>    <html class="no-js iem7"> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!--> <html class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<title>TextTV.nu backbone version</title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">

	<link rel="stylesheet" href="bower_components/ionic/release/css/ionic.css">
	<link rel="stylesheet" href="bower_components/swiper/dist/idangerous.swiper.css">
	<link rel="stylesheet" href="css/texttv-theme-black.css">
	<link rel="stylesheet" href="bower_components/animate.css/animate.css">

	<script src="bower_components/jquery/jquery.js"></script>
	<script src="bower_components/underscore/underscore.js"></script>
	<script src="bower_components/backbone/backbone.js"></script>
	<!-- <script src="bower_components/handlebars/handlebars.min.js"></script> -->
	<!-- <script src="bower_components/ionic/release/js/ionic.js"></script> -->
	<script src="bower_components/swiper/dist/idangerous.swiper-2.4.js"></script>

</head>

<body>

	<div id="MainView" class="view view--main"></div>
	
	<script id="MainViewTemplate" type="text/x-template">
		<div id="MainView" class="view view--main">
		
			<div class="bar bar-header bar-positive">

				<button class="button button-clear">
					<i class="icon ion-ios7-arrow-back"></i>
					Tillbaka
				</button>

				<h1 class="title">
					<% if (title == "TextTV.nu") { %>
						<img src="img/logo.png" alt="'" height="15">
					<% } %>
					<%- title %>
				</h1>

				<button class="button button-clear icon ion-navicon js-sidebarOpenClose"></button>

			</div>

			<div class="content has-header">
				
				<p>texttv-sidor kommer här dårå</p>

			</div>

		</div>
	</script>

	<div id="SidebarRight" class="menu menu-right">

		<header class="bar bar-header bar-dark">
			<h1 class="title">Meny</h1>
			<button class="button button-clear ion-close-circled js-sidebarOpenClose"></button>
		</header>

		<div class="scroll-content has-header" scroll="true" overflow-scroll="false" has-header="true">
			
			<div class="list">
				<a class="item">Start <span class="item-note">100</span></a>
				<a class="item">Nyheter <span class="item-note">100-105</span></a>
				<a class="item">Inrikes <span class="item-note">101-102</span></a>
				<a class="item">Urikes <span class="item-note">104-105</span></a>
				<a class="item">Ekonomi <span class="item-note">200</span></a>
				<a class="item">Sport <span class="item-note">300-301</span></a>
				<a class="item">Sportresultat <span class="item-note">377</span></a>
				<a class="item">Sportresultat, V75 <span class="item-note">571</span></a>
				<a class="item">Väder <span class="item-note">400</span></a>
				<a class="item">Blandat <span class="item-note">500</span></a>
				<a class="item">På TV <span class="item-note">600</span></a>
				<a class="item">Innehåll <span class="item-note">700</span></a>
				<a class="item">UR <span class="item-note">800</span></a>
			</div>

		</div>

	</div>

	<script>

		/**
		 * Sidebar model
		 */
		var Sidebar = Backbone.Model.extend({

			defaults: {
				isOpen: false
			},			

			open: function() {
				console.log("Open sidebar");
			},
			close: function() {
				console.log("Close sidebar");
			},
			openClose: function() {
				console.log("Open or close sidebar in model");
			},


		});
		window.sidebar = new Sidebar();

		/**
		 * Sidebar view
		 */
		var SidebarView = Backbone.View.extend({
			
			events: {
				"click .js-sidebarOpenClose": "openClose"
			},

			initialize: function() {
				this.listenTo(this.model, "change", this.render);
			},

			openClose: function() {
				console.log("Open or close sidebar in view");
				mainView.openClose();
			},

			render: function() {
				console.log("Render sidebarView");
				return this;

			}

		});
		window.sidebarView = new SidebarView({
			el: "#SidebarRight",
			model: sidebar
		});

		/**
		 * Main view and model
		 */
		var MainModel = Backbone.Model.extend({
		
			defaults: {
				title: "TextTV.nu"
			}

		});
		window.mainModel = new MainModel();

		var MainView = Backbone.View.extend({
			el: "#MainView",
			//template: Handlebars.compile( $("#MainViewTemplate").html() ),
			template: _.template( $("#MainViewTemplate").html() ),
			events: {
				"click .js-sidebarOpenClose": "openClose"
			},

			initialize: function() {
				this.listenTo(this.model, "change", this.render);
				this.render();
			},

			openClose: function() {
				console.log("Open or close sidebar in main view");
				this.$el.toggleClass("open-sidebar");
			},

			render: function() {
				console.log("Render mainView");
				var renderedHTML = this.template( this.model.attributes );
				this.$el.html(renderedHTML);
				return this;
			}

		});
		window.mainView = new MainView({
			model: mainModel
		});
		
	</script>

	<style>
		#MainView {
			-webkit-transition: all .15s ease-in-out;
		}
		#MainView.open-sidebar {
			-webkit-transform: translateX(-275px);
		}
	</style>


</body>
</html>