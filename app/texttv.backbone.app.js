
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
			addToSwiper: true,
			animateSwiper: false
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
		swiperSlide: null,

		addToSwiper: false,
		animateSwiper: true
	},

	templateLoading: _.template( $("#LoadingPageTemplate").html() ),
	templateLoadingFailed: _.template( $("#LoadingPageTemplateFailed").html() ),
	templatePage: _.template( $("#TextTVPageTemplate").html() ),

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
		
		// Add new slide and swipe to that directly. Content from server has not arrived yet.
		var newSlide = TextTVSwiper.swiper.createSlide( this.templateLoading(this.attributes) );
		
		newSlide.append();

		// Store a reference to this model in the slide, so we from the slide can get this model
		$.data(newSlide, "parentmodel", this);
		newSlide.parentModel = this;
		
		// mySwiper.swipeTo(index, speed, runCallbacks)
		// run transition to the slide with index number equal to 'index' parameter for the speed equal to 'speed' parameter.
		// You can set 'runCallbacks' to false (by default it is 'true') 
		// and transition will not produce onSlideChange callback functions.
		var speed = this.get("animateSwiper") ? TextTVSwiper.swiper.params.speed : 0;
		TextTVSwiper.swiper.swipeTo( newSlide.index(), speed );

		this.set("swiperSlide", newSlide);

	},

	/**
	 * When source data has changed = page has loaded from server
	 */
	sourceDataChanged: function() {
		
		this.addContentToSwiper();

		var swiperSlide = this.get("swiperSlide");
		
		TextTVSwiper.prepareSliderAfterPageChange();

	},

	/**
	 * Add page contents to the swiper slide when the ajax call is done
	 */
	addContentToSwiper: function() {
		
		var swiperSlide = this.get("swiperSlide");
		var sliderHTML = this.templatePage( this.attributes );

		swiperSlide.html(sliderHTML);

	},

	/**
	 * Load a the range of pages via AJAX
	 */
	loadPageRange: function() {

		var ajaxPromise = $.ajax({
			dataType: "json",
			url: "http://texttv.nu/api/get/" + this.get("pageRange"),
			context: this,
			cache: false, // @TODO do our own caching later on...
			// data: { slow_answer: 1 }, // enable this to test how it looks with slow network
			// timeout: 1000 // enable this to test timeout/fail message
		})
			.done(function(r) {
				//console.log("Got remote data", r, this);
				this.set("sourceData", r);
			})
			.fail(function(r) {
				//console.log("Dit NOT get remote data, something failed", r);
				this.loadFailed();
			});

		this.set("ajaxPromise", ajaxPromise);

	},

	loadFailed: function() {
		
		var swiperSlide = this.get("swiperSlide");
		swiperSlide.html( this.templateLoadingFailed(this.attributes) );

	}

});

texttvapp.textTVPage = TextTVPageModel;

var TextTVPagesCollection = Backbone.Collection.extend({

	model: TextTVPageModel,

	initialize: function() {
		this.on("add", this.pageAdded);
	},

	pageAdded: function(addedPage) {
		// console.log("page was added to collection", addedPage);
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

		//console.log("load home");
		var pageRange = 100;
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: pageRange,
			addToSwiper: true,
			animateSwiper: false
		}) );

	},

	clickLinkInRoot: function(e) {
		
		var $a = $(e.target);

		// Check if link is texttv-link, i.e. a link that looks like /nnn or /nnn-nnn
		//var $root = $a.closest(".root");
		//if ( $root.length ) {

		var href = _.str.trim( $a.attr("href"), " /");
		
		// Check if link is nnn or nnn-nnn
		var matches = href.match(/\d{3}(-\d{3})?/);
		// console.log(href, matches);
		if ( matches !== null) {

			// Seems to be a texttv-link
			//console.log("Link looks like texttv-link", href);
			var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
				pageRange: href,
				addToSwiper: true,
				animateSwiper: false
			}) );


		}


		// }
		
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
 * Initialized is called from mainView
 */
var TextTVSwiper = {
	
	elms: [],
	
	initialize: function() {
		
		this.swiper_container = $('.swiper-container');
		this.swiper = this.swiper_container.swiper({
			mode:'horizontal',
			loop: false,

			// Callback function, will be executed when you release the slider
			onTouchEnd: this.onTouchEnd,

			// Callback function, will be executed in the beginning of animation to other slide (next or previous). Don't work with freeMode.
			onSlideChangeStart: this.onSlideChangeStart,

			// Callback function, will be executed after animation to other slide (next or previous). Don't work with freeMode.
			onSlideChangeEnd: this.onSlideChangeEnd

			//onSlideNext, onSlidePrev

		});

		this.templateNextPage = _.template( $("#NextPageTemplate").html() );
		this.templatePrevPage = _.template( $("#PrevPageTemplate").html() );

	},

	onTouchEnd: function() {
		// console.log("onTouchEnd");
	},

	onSlideChangeStart: function() {
		// console.log("onSlideChangeStart");
	},

	/**
	 * When slide is changed, make before and after slides empty pages, not loaded, but ready to be
	 */
	onSlideChangeEnd: function(swiper, direction) {
		
		if ("to" == direction) {
			return false;
		}

		TextTVSwiper.prepareSliderAfterPageChange();

	},

	prepareSliderAfterPageChange: function() {
		console.log("prepareSliderAfterPageChange()");
		var slides = TextTVSwiper.swiper.slides;
		var activeSlide = TextTVSwiper.swiper.activeSlide();
		var activeSlideClone = activeSlide.clone();
		var activeSlideIndex = TextTVSwiper.swiper.activeIndex;
		var parentModel = activeSlide.parentModel;
		var parentAttributes = parentModel && parentModel.attributes || {};

		// Copy over parent model from slide to new clone
		activeSlideClone.parentModel = parentModel;
		
		// Keep only our current slide
		TextTVSwiper.swiper.removeAllSlides();
		activeSlideClone.append();

		// Create data for template
		var templateData = {
			nextPageRange: null,
			prevPageRange: null
		};

		if (parentAttributes && parentAttributes.sourceData && parentAttributes.sourceData[0]) {
			templateData.nextPageRange = parentAttributes.sourceData[0].next_page;
			templateData.prevPageRange = parentAttributes.sourceData[0].prev_page;
		}

		// Create slide before current page
		var slideBefore = TextTVSwiper.swiper.createSlide( TextTVSwiper.templatePrevPage(templateData) );
		slideBefore.prepend();

		// Create empty slide after current page
		var slideAfter = TextTVSwiper.swiper.createSlide( TextTVSwiper.templateNextPage(templateData) );
		slideAfter.append();

		// Finally slide to second slide = the slide we slided to
		TextTVSwiper.swiper.swipeTo(1, 0, false);

	}

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

