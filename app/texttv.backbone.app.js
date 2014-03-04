
// Add fastclick on load
window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);

var texttvapp = texttvapp || {};


/**
 * Sidebar model
 */
var Sidebar = Backbone.Model.extend({

	defaults: {
		isOpen: false
	}

});

texttvapp.sidebar = new Sidebar();


/**
 * Sidebar view
 */
var SidebarView = Backbone.View.extend({
	
	events: {
		"click .js-sidebarToggle": "toggle",
		"click .list--pages .item": "itemClick",
	},

	initialize: function() {
		this.listenTo(this.model, "change:isOpen", this.openOrClose);
	},

	openOrClose: function() {
		texttvapp.mainView.$el.toggleClass("open-sidebar", this.model.get("isOpen"));
	},

	close: function() {
		this.model.set("isOpen", false);
	},

	toggle: function() {
		
		// console.log("Open or close sidebar in sidebar view");
		this.model.set("isOpen", !this.model.get("isOpen"));

	},

	render: function() {
		console.log("Render sidebarView");
		return this;

	},

	itemClick: function(e) {
		
		// console.log("click sidebar page range");
		
		e.preventDefault();
		
		var $item = $(e.target).closest(".item");
		var pageRange = $item.data("pagerange");

		// Init a page and load it
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: pageRange,
			addToSwiper: true
		}) );

		this.close();

	}

});

texttvapp.sidebarView = new SidebarView({
	el: "#SidebarRight",
	model: texttvapp.sidebar
});



/**
 * A texttv-page
 */
var TextTVPageModel = Backbone.Model.extend({

	defaults: {
		pageRange: null,
		sourceData: null,
		ajaxPromise: null,

		// The swiper slide that has been connected to this page
		swiperSlide: null
	},

	initialize: function() {
		
		this.on("change:pageRange", this.loadPageRange);
		this.on("change:sourceData", this.sourceDataChanged);

		// Load pagerange directly if set on init
		if ( this.has("pageRange") ) {
			this.loadPageRange();
		}

		// Add to swiper directly
		if (this.get("addToSwiper") ) {
			this.addToSwiper();
		}

	},

	addToSwiper: function() {

		var ajaxPromise = this.get("ajaxPromise");
		
		var newSlide = TextTVSwiper.swiper.createSlide('<p>Laddar ' + this.get("pageRange") + '</p>');
		newSlide.append();
		
		this.set("swiperSlide", newSlide);

	},

	sourceDataChanged: function() {
		
		this.addContentToSwiper();

		var swiperSlide = this.get("swiperSlide");
		TextTVSwiper.swiper.swipeTo( swiperSlide.index() );

	},

	/**
	 * Add page contents to the swiper slide when the ajax call is done
	 */
	addContentToSwiper: function() {
		
		console.log("addContentToSwiper");
		var sourceData = this.get("sourceData");
		var sliderHTML = "";
		
		_.each(sourceData, function(onePageData) {
			for (var i = 0; i < onePageData.content.length; i++) {
				sliderHTML += onePageData.content[i];
			}
		});
		
		var swiperSlide = this.get("swiperSlide");
		console.log("swiperSlide", swiperSlide);
		swiperSlide.html(sliderHTML);

	},

	loadPageRange: function() {

		var ajaxPromise = $.ajax({
			dataType: "json",
			url: "http://texttv.nu/api/get/" + this.get("pageRange"),
			context: this
		})
			.done(function(r) {
				console.log("Got remote data", r);
				this.set("sourceData", r);
			})
			.fail(function(r) {
				console.log("Dit NOT get remote data, something failed", r);
			});

		this.set("ajaxPromise", ajaxPromise);

	}

});

texttvapp.textTVPage = TextTVPageModel;

var TextTVPagesCollection = Backbone.Collection.extend({

	model: TextTVPageModel,

	initialize: function() {
		this.on("add", this.pageAdded);
	},

	pageAdded: function(addedPage) {
		console.log("page was added to collection", addedPage);
	}

});

texttvapp.TextTVPages = new TextTVPagesCollection();


/*
var testpage = new texttvapp.textTVPage({ pageRange: "100-101" });
*/

/**
 * Main view and model
 */
var MainModel = Backbone.Model.extend({

	defaults: {
		title: "TextTV.nu",
		hasPrevPage: false
	}

});

texttvapp.mainModel = new MainModel();


/**
 * MainView = view that controls the GUI
 */
var MainView = Backbone.View.extend({
	
	el: "#MainView",
	
	template: _.template( $("#MainViewTemplate").html() ),

	events: {
		"click .js-sidebarToggle": "toggleSidebar",
		"click a": "clickLinkInRoot"
	},

	/**
	 * Init the app
	 */
	initialize: function() {
		
		this.listenTo(this.model, "change", this.render);
		this.render();
		
		TextTVSwiper.initialize();

		this.loadHome();

	},

	loadHome: function() {

		console.log("load home");
		var pageRange = 100;
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: pageRange,
			addToSwiper: true
		}) );

	},

	clickLinkInRoot: function(e) {
		
		var $a = $(e.target);

		// Check if link is inside .root
		var $root = $a.closest(".root");
		if ( $root.length ) {
			var href = $a.attr("href");
			console.log("href", href);
		}
		
		e.preventDefault();

	},

	toggleSidebar: function() {
		// console.log("Open or close sidebar in main view");
		texttvapp.sidebarView.toggle();
	},

	render: function() {
		// console.log("Render mainView");
		var renderedHTML = this.template( this.model.attributes );
		this.$el.html(renderedHTML);
		return this;
	}

});

/**
 * Controls the Swiper
 */
var TextTVSwiper = {
	
	elms: [],
	
	initialize: function() {
		
		this.swiper_container = $('.swiper-container');
		this.swiper = this.swiper_container.swiper({
			mode:'horizontal',
			loop: false
		});

	},
/*
	addPage: function(page) {
		
		// Use ajaxPromise to detect when page is loaded (or failed)
		// Wait until loaded to add content to new swiper slide
		var ajaxPromise = page.get("ajaxPromise");

		var newSlide = this.swiper.createSlide('<p>Here is my new slide yo</p>');
		newSlide.append();

		ajaxPromise.done(this.pageDoneLoading);

	},

	pageDoneLoading: function(r) {
		console.log("ey!", r);
	}
*/
};
_.extend(TextTVSwiper, Backbone.Events);

texttvapp.mainView = new MainView({
	model: texttvapp.mainModel
});

