
// Add fastclick on load
window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);

var texttvapp = texttvapp || {};

/**
 * Add helpers
 */
texttvapp.helpers = {

	/**
	 * Check if link is texttv-link, i.e. a link that looks like /nnn or /nnn-nnn
	 */
	isValidPageRange: function(pageRange) {
		var matches = pageRange.match(/\d{3}(-\d{3})?/);
		return (matches !== null);
	},

	updateMostVisited: function() {

		var test = texttvapp.storage.get("stats", function(stats) { 

			var pages = stats.pages;
			pages = _.sortBy(pages, function(val) { return val.count; });
			pages = pages.reverse();

			// Exclude some common pages, like 100 that feels unnessesary since it's at the top of the pages below anyway (and will always be the top one..)
			var excludedPageRanges = [100];
			pages = _.filter(pages, function(item) {
				return ( excludedPageRanges.indexOf(item.pageRange) === -1 );
			});

			// Only show the latest nn pages
			pages = pages.slice(0, 4);

			var $elm = $("#SidebarMostVisisted");
			var templateMostVisited = _.template( $("#MostVisitedTemplate").html() );
			$elm.html( templateMostVisited( { pages: pages } ) );

		});

	}

};

texttvapp.storage = new Lawnchair({
	name: "texttv",
	adapter: "dom"
}, function(storage) {
	
	// console.log("Storage init");
	
	storage.exists("stats", function(exists) {
		if (false === exists) {
			storage.save({
				key: "stats",
				pages: {}
			});
		}
	});


});

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
		"click .list--pages .item-texttvpage": "itemClick",
		//"change .sidebar-input-page": "inputChange",
		"keyup .sidebar-input-page": "inputChange",
	},

	initialize: function() {
		
		this.listenTo(this.model, "change:isOpen", this.openOrClose);

	},

	openOrClose: function() {

		texttvapp.mainView.$el.closest(".view--main").toggleClass("open-sidebar", this.model.get("isOpen"));

	},

	close: function() {
		this.model.set("isOpen", false);
	},

	toggle: function() {
		
		this.model.set("isOpen", !this.model.get("isOpen"));

	},

	render: function() {

		return this;

	},

	// Load pageRange when changing to a valid pageRange in the input
	inputChange: function(e) {
		
		var $target = $(e.target);
		var pageRange = $target.val();

		if ( texttvapp.helpers.isValidPageRange(pageRange)) {

			// Init a page and load it
			var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
				pageRange: pageRange,
				addToSwiper: true,
				animateSwiper: false,
				initiatedBy: "manual"
			}) );

			$target.val("");
			$target.blur();

			this.close();

		}


	},

	// Load pageRange when clicking a pageRank-link
	itemClick: function(e) {
			
		e.preventDefault();
		
		var $item = $(e.target).closest(".item");
		var pageRange = $item.data("pagerange");

		// Init a page and load it
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: pageRange,
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "click"
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
		animateSwiper: true,

		// type of event that inited this page load, like "swipe" or "click"
		// used to determine if the prev-button should be shown
		initiatedBy: null,

		prevPageSourceData: null
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

		// Update most visited after each load
		texttvapp.helpers.updateMostVisited();

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

		// var swiperSlide = this.get("swiperSlide");
		
		TextTVSwiper.prepareSliderAfterPageChange();

	},

	/**
	 * Add page contents to the swiper slide when the ajax call is done
	 */
	addContentToSwiper: function() {
		
		var swiperSlide = this.get("swiperSlide");
		var sliderHTML = this.templatePage( this.attributes );

		swiperSlide.html(sliderHTML);
		
		// If we have history then show back button
		var $backbutton = $(".js-backButton");
		if (texttvapp.TextTVPagesHistory.length > 0 && 100 != texttvapp.TextTVPagesHistory.last().get("pageRange")) {
		
			/*
			// Don't add current pageRange to the back button, it got confusing to see all those ranges everywhere
			var $backbuttonText = $(".js-backButton-text");
			$backbuttonText.text( texttvapp.TextTVPagesHistory.at( texttvapp.TextTVPagesHistory.length-2 ).get("pageRange") );
			*/
			
			$backbutton.addClass("button-back--enabled");

		} else {

			$backbutton.removeClass("button-back--enabled");

		}

	},

	/**
	 * Load a the range of pages via AJAX
	 */
	loadPageRange: function() {

		var self = this;
		var ajaxPromise = $.ajax({
			dataType: "json",
			url: "http://texttv.nu/api/get/" + this.get("pageRange"),
			context: this,

			// @TODO do our own caching later on...
			// http://api.jquery.com/jquery.ajaxprefilter/
			// beforeSend
			// http://stackoverflow.com/questions/10585578/changing-the-cache-time-in-jquery
			cache: false,

			//data: { slow_answer: 1 }, // enable this to test how it looks with slow network
			// timeout: 1000 // enable this to test timeout/fail message
		})	
			// when a page is done loading from server
			.done(function(r) {
				
				// set sourcedata, will trigger page template render
				this.set("sourceData", r);

				// Update stats for use in sidebar
				var stats = texttvapp.storage.get("stats", function(stats) {
	
					var pageRange = self.get("pageRange");
					
					// If this is the first load of this pageRange then add it to the stats array
					if ( !_.has(stats.pages, pageRange)) {

						stats.pages[pageRange] = {
							pageRange: pageRange,
							count: 0
						};

					}
					
					stats.pages[pageRange].count++;

					// Save stats
					texttvapp.storage.save(stats, function(stats) {
						// after stats added
					});

				}); // stats sidebar

			})

			// when loading failes, due to network down, lag, etc.
			.fail(function(r) {

				// Did NOT get remote data, something failed
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


var TextTVPagesClickCollection = Backbone.Collection.extend({

	model: TextTVPageModel,

	initialize: function() {
		this.on("add", this.pageAdded);
	},

	pageAdded: function(addedPage) {
		
	}

});

texttvapp.TextTVPagesHistory = new TextTVPagesClickCollection();

var TextTVPagesCollection = Backbone.Collection.extend({

	model: TextTVPageModel,

	initialize: function() {
		this.on("add", this.pageAdded);
	},

	pageAdded: function(addedPage) {
		
		// Keep track of all pages that should be in history
		if ( "backButton" == addedPage.get("initiatedBy") || "homeButton" == addedPage.get("initiatedBy") || "click" == addedPage.get("initiatedBy") ) {

			texttvapp.TextTVPagesHistory.add( addedPage );

		}


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
 * MainViewBar = the main bar with back button and texttv.nu-logo
 * own view since mainvew can't be updated because then slider get's overwritten
 */
var MainViewBar = Backbone.View.extend({
	
	el: "#MainViewBar",
	
	template: _.template( $("#MainViewBarTemplate").html() ),

	events: {
		"click .js-sidebarToggle": "toggleSidebar",
		"click .bar-header-titleLink": "loadHome",
		"click .js-backButton": "backButton"
	},

	/**
	 * The backbutton. The most used button on the web, but will it be the most clicked in this app??!
	 */
	backButton: function(e) {

		e.preventDefault();

		// All history is in texttvapp.TextTVPagesHistory
		// We don't want to go to the current page, which is texttvapp.TextTVPagesHistory.length - 1
		// so remove that
		console.table(texttvapp.TextTVPagesHistory.toJSON());
		texttvapp.TextTVPagesHistory.pop();

		// but be want to go to the page before that, texttvapp.TextTVPagesHistory.length - 2, or the last one after we removed the current page
		var prevPageModel = texttvapp.TextTVPagesHistory.last();

		// remove the last item if it's not the last one = page 100, we always keep that
		if (texttvapp.TextTVPagesHistory.length > 1) {
			texttvapp.TextTVPagesHistory.pop();
		}

		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: prevPageModel.get("pageRange"),
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "backButton"
		}) );
	},

	toggleSidebar: function() {

		texttvapp.sidebarView.toggle();

	},

	loadHome: function(e) {
		
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: 100,
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "click"
		}) );

		e.preventDefault();

	},

	render: function() {

		var renderedHTML = this.template( this.model.attributes );
		this.$el.html(renderedHTML);		

	},

	initialize: function() {
		
		this.render();

	}

});


/**
 * MainView = view that controls the GUI
 */
var MainView = Backbone.View.extend({
	
	el: "#MainView",
	
	template: _.template( $("#MainViewTemplate").html() ),

	events: {
		"click .js-sidebarToggle": "toggleSidebar",
		"click a": "clickLinkInRoot",
		"click .js-reloadPage": "reloadPage",
		"click .js-sharePage": "sharePage"
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

	sharePage: function() {

		var activeSlide = TextTVSwiper.swiper.activeSlide();
		
		if (activeSlide.parentModel) {
			
			var loadingElm = $( _.template( $("#LoadingTemplate").html() )() );
			$("body").append(loadingElm);
			loadingElm.addClass("active");

			var sourceData = activeSlide.parentModel.get("sourceData");
			var pageIDs = _.pluck(sourceData, "id").join(",");

			// Call the texttv api to get permalink and screenshot
			// http://digital.texttv.nu/api/share/2664651
			var apiEndpoint = "http://digital.texttv.nu/api/share/" + pageIDs;

			$.getJSON(apiEndpoint)
				// api call successful
				.done(function(data) {
									
					if (data.is_ok === false) {
						alert("Kunde inte dela sidan just nu. Försök igen om en stund!");
						return;
					}
					// data {"is_ok":true,"screenshot":"http:\/\/digital.texttv.nu\/shares\/1396188677636-63433060.gif","permalink":"http:\/\/digital.texttv.nu\/100\/arkiv\/sida\/2752920"}
					window.plugins.socialsharing.share(data.permalink, // body text
												data.title,  // title?
												data.screenshot, // image
												null, // link
												function(msg) { console.log(msg); }, function(msg) { console.log(msg); });

				})
				// api call not successful
				.fail(function() {

				})
				// always
				.then(function() {
					loadingElm.remove();
				});
			//var shareURL = "http://texttv.nu/sida/arkiv/sidor/" + _.pluck(sourceData, "id").join(",");

		}



	},

	/**
	 * Reloads the current page range
	 */
	reloadPage: function() {

		var currentSlide = TextTVSwiper.swiper.activeSlide();

		// parentModel = TextTVPageModel
		var parentModel = currentSlide.parentModel;
		//parentModel.loadPageRange();
		
		// parentModel.attributes.sourceData[0].next_page = "apa";
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: parentModel.get("pageRange"),
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "reloadButton"
		}) );

	},

	loadHome: function() {

		var pageRange = 100;
		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: pageRange,
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "homeButton"
		}) );

	},

	clickLinkInRoot: function(e) {
		
		var $a = $(e.target);
		var href = _.str.trim( $a.attr("href"), " /");

		// Check if link is texttv-link, i.e. a link that looks like /nnn or /nnn-nnn
		if ( texttvapp.helpers.isValidPageRange(href) ) {

			// Seems to be a texttv-link
			var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
				pageRange: href,
				addToSwiper: true,
				animateSwiper: false,
				initiatedBy: "click"
			}) );

		}
		
		e.preventDefault();

	},

	render: function() {
		
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

		// If we just swiped to a slide that is a "page placeholder" then load that page
		var activeSlide = TextTVSwiper.swiper.activeSlide();
		if (activeSlide.parentModel) {
	
			// If slide already contains a page then prepare that slide for next next/prev-swipe
			TextTVSwiper.prepareSliderAfterPageChange();

		} else if (activeSlide.pageRange) {
		
			var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
				pageRange: activeSlide.pageRange,
				addToSwiper: true,
				animateSwiper: false,
				initiatedBy: "swipe"
			}) );

		}

	},

	prepareSliderAfterPageChange: function() {
			
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
		slideBefore.pageRange = templateData.prevPageRange;
		// @BUG: this makes webkit-overflow-scrolling not working in the sidebar
		slideBefore.prepend();

		// Create empty slide after current page
		var slideAfter = TextTVSwiper.swiper.createSlide( TextTVSwiper.templateNextPage(templateData) );
		slideAfter.pageRange = templateData.nextPageRange;
		slideAfter.append();

		// Finally slide to second slide = the slide we slided to
		TextTVSwiper.swiper.swipeTo(1, 0, false);

	}

};
_.extend(TextTVSwiper, Backbone.Events);

texttvapp.mainView = new MainView({
	model: texttvapp.mainModel
});

texttvapp.mainViewBar = new MainViewBar({
	model: texttvapp.mainModel
});

function onDeviceReady() {
    navigator.splashscreen.show();
	// Add classes to body depending on current device
	var css_platform = "platform-" + device.platform.toLowerCase() + parseInt(device.version);
	document.querySelector("body").classList.add(css_platform, "platform-cordova");

	navigator.splashscreen.hide();

}
document.addEventListener('deviceready', onDeviceReady, false);

/**
 * Scroll to top when tap on status bar
 */
window.addEventListener("statusTap", function() {
	
	$(".swiper-slide-active").scrollTop(0);

});