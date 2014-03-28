
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
		
		// console.log("Open or close sidebar in sidebar view");
		this.model.set("isOpen", !this.model.get("isOpen"));

	},

	render: function() {
		console.log("Render sidebarView");
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

		// Get history items
		/*var click_history = texttvapp.TextTVPages.filter(function(item) {
			return ( item.get("initiatedBy") == "click" || item.get("initiatedBy") == "homeButton" );
		});

		// Remove last entry (which is the current item)
		click_history.pop();
		*/

		
		// If we have history then show back button
		console.table( texttvapp.TextTVPagesHistory.toJSON() );
		var $backbutton = $(".js-backButton");
		if (texttvapp.TextTVPagesHistory.length > 0 && 100 != texttvapp.TextTVPagesHistory.last().get("pageRange")) {
		
			var $backbuttonText = $(".js-backButton-text");
			$backbuttonText.text( texttvapp.TextTVPagesHistory.at( texttvapp.TextTVPagesHistory.length-2 ).get("pageRange") );
			$backbutton.addClass("button-back--enabled");
			/*$backbutton.animate({
				opacity: 1,
				display: "block"
			});*/

		} else {
			$backbutton.removeClass("button-back--enabled");
		}

		//console.log( click_history );


		// update bar
		//texttvapp.mainViewBar.render();
		//texttvapp.mainViewBar.model.set("hasPrevPagex", 123);

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
				
				//console.log("Got remote data", r, this);
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
						// console.log("added stats", stats);
					});

				}); // stats sidebar

				// Save data for back-button
				/*if ( this.get("initiatedBy") == "click" ) {

					console.log( "page load was initiated by click = show back button to prev page" );
					console.log( this.get("pageRange") );
					
				}*/

				// Save all page loads in a global history?
				// OK stupid, texttvapp.TextTVPages already is a collection with all pages!



			})

			// when loading failes, due to network down, lag, etc.
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


var TextTVPagesClickCollection = Backbone.Collection.extend({

	model: TextTVPageModel,

	initialize: function() {
		this.on("add", this.pageAdded);
	},

	pageAdded: function(addedPage) {
		// console.log("page was added to collection", addedPage);
		// Keep track of all pages that should be in history
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
		//console.log("page was added to collection", addedPage.get("initiatedBy"));

		if ( "backButton" == addedPage.get("initiatedBy") || "homeButton" == addedPage.get("initiatedBy") || "click" == addedPage.get("initiatedBy") ) {
			// console.log("add to click history");
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

		console.log("Click back button");
		e.preventDefault();

		// Get all click history
		/*var click_history = texttvapp.TextTVPages.filter(function(item) {
			return ( item.get("initiatedBy") == "click" || item.get("initiatedBy") == "homeButton" );
		});

		// Remove last entry = the current page, since we don't want to go back to the same page
		click_history.pop();

		// Now the last item should be the one we want to go back to

		var prevPage = _.last(click_history);
		*/

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
		// remove the prevPageModel from the history
		//console.table(texttvapp.TextTVPagesHistory.toJSON());
		console.table(texttvapp.TextTVPagesHistory.toJSON());
		// then also remove the last item = 

		var page = texttvapp.TextTVPages.add( new texttvapp.textTVPage({
			pageRange: prevPageModel.get("pageRange"),
			addToSwiper: true,
			animateSwiper: false,
			initiatedBy: "backButton"
		}) );


	},

	toggleSidebar: function() {
		//console.log("Open or close sidebar in main view");
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

		// console.log("render mainviewbar");
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

	/**
	 * Reloads the current page range
	 * @TODO: if remote page has not changed then "nothing" will happen
	 * due to sourceData never changing
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

		//console.log("load home");
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
		
		// console.log("Render mainView");
		
		var renderedHTML = this.template( this.model.attributes );
		this.$el.html(renderedHTML);		
		
		//var barHTML = this.templateBar( this.model.attributes );
		//this.$el.find("#MainViewBar").html( barHTML );
		
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

			// console.log("load page!", activeSlide.pageRange);
			
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

texttvapp.mainViewBar = new MainViewBar({
	model: texttvapp.mainModel
});

function onDeviceReady() {

}
document.addEventListener('deviceready', onDeviceReady, false);

