
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

// Initialize storage using Lawnchair
texttvapp.storage = new Lawnchair({
	name: "texttv",
	adapter: "dom"
}, function(storage) {

	// console.log("Storage init");

	// Make sure "stats" storage exists, as empty object by default
	storage.exists("stats", function(exists) {
		
		if (false === exists) {

			storage.save({
				key: "stats",
				pages: {}
			});

		}
	});

	// Make sure "favs" storage exists, as empty object by default
	storage.exists("favs", function(exists) {
		
		if (false === exists) {

			storage.save({
				key: "favs",
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
		var self = this;

		// due to bug/feature of swiper we need to hide it to make touch scrolling w overflow of sidebar work
		/*console.log(123)
		$(".swiper-container").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function() {

			//$(this).css({ display: "none" });
			console.log(self.model.get("isOpen"));

		});
		*/
		//, function(e) {
		//});

	},

	close: function() {
		this.model.set("isOpen", false);
	},

	// click on sidebar ikon
	toggle: function() {

		if (typeof analytics !== "undefined") {
			var strOpenOrClose = this.model.get("isOpen") ? "Close" : "Open";
			analytics.trackEvent('App', 'Sidebar', strOpenOrClose);
		}

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

		// texttvapp.helpers.updateFavs();

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

		// Cache requests by adding timestamp that is rounded to nearest minute, downwards
		// so all requests within a minute can get cached by nginx
		// Request URL will be like: http://texttv.nu/api/get/110-111/?cb=2014-3-2_19:7
		var cacheBusterTime = new Date();
		var cacheBusterString = cacheBusterTime.getUTCFullYear() + "-" + cacheBusterTime.getUTCDay() + "-" + cacheBusterTime.getUTCDate() + "_" + cacheBusterTime.getUTCHours() + ":" + cacheBusterTime.getUTCMinutes();

		var self = this;
		var ajaxPromise = $.ajax({
			dataType: "json",
			url: "http://api.texttv.nu/api/get/" + this.get("pageRange") + "/?cb=" + cacheBusterString,
			context: this,
			cache: true,
			//data: { slow_answer: 1 }, // enable this to test how it looks with slow network
			// timeout: 1000, // enable this to test timeout/fail message
			timeout: 3000
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

		// Let's track all pages
		if (typeof analytics !== "undefined") {

			analytics.trackView("Load pageRange " + addedPage.get("pageRange"));

			// Analytics kind of interaction used to load next pageRange
			analytics.trackEvent('App', 'Nav initiation', addedPage.get("initiatedBy"));

		}

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

	clickAnywhere: function(e) {
		console.log(123);
	},

	/**
	 * The backbutton. The most used button on the web, but will it be the most clicked in this app??!
	 */
	backButton: function(e) {

		e.preventDefault();

		// All history is in texttvapp.TextTVPagesHistory
		// We don't want to go to the current page, which is texttvapp.TextTVPagesHistory.length - 1
		// so remove that
		// console.table(texttvapp.TextTVPagesHistory.toJSON());
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
			var pageNums = _.pluck(sourceData, "num").join(",");

			analytics.trackEvent('App', 'Share', pageNums);

			// Call the texttv api to get permalink and screenshot
			// http://digital.texttv.nu/api/share/2664651
			var apiEndpoint = "http://api.texttv.nu/api/share/" + pageIDs;

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

		analytics.trackEvent('App', 'ReloadPage', parentModel.get("pageRange"));

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
			onSlideChangeEnd: this.onSlideChangeEnd,

			// Callback function, will be executed when swiper's wrapper change its position.
			// p - returns object with current transform offset.
			/*
			onSetWrapperTransform: function(swiper, transform) {
				//console.log("onSetWrapperTransform", transform);
				//console.log( swiper.width );
				//console.log( swiper.width - transform.x );

				// minus = going forward
				// positive = going backward
				var pos = swiper.width + transform.x;
				var nextSlideIndex = null;
				var newPos;

				if (pos > 0) {
					nextSlideIndex = swiper.activeIndex - 1;
					newPos = (swiper.width/2) - pos/2;
				} else {
					nextSlideIndex = swiper.activeIndex + 1;
					newPos = (swiper.width/2) + pos/2;
				}


				console.log( "nextSlideIndex", nextSlideIndex );
				//console.log( swiper.activeIndex );
				var nextSlide = swiper.getSlide( nextSlideIndex );

				var text = $(".placeholderPage--next");
				console.log(text.length);
				
				text.css({
					WebkitTransform: 'translateX(-'+newPos+'px)'
				});
				console.log(text);
			},
			*/

			/*onTouchMove: function(swiper){
				console.log("onTouchMove", this);
			}*/

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


/**
 * Favs model
 */
var FavsModel = Backbone.Model.extend({

	defaults: {
		favs: {}
	}

});

texttvapp.favs = new FavsModel();

var FavsView = Backbone.View.extend({

	template: _.template( $("#FavsTemplate").html() ),
	template_single: _.template( $("#FavsItemTemplate").html() ),

	events: {
		"click .abc": "func",
		"click .FavsItemEdit": "beginEdit",
		"click .FavsItemEditDone": "endEdit",
		"click .FavsItem-remove": "askToRemoveItem",
		"keyup .sidebar-input-favitem-add": "inputChange",
	},

	initialize: function() {

		this.render();
		this.makeSortable();

	},

	beginEdit: function() {
		this.$el.addClass("is-editing");
	},

	endEdit: function() {
		this.$el.removeClass("is-editing");
	},

	inputChange: function(e) {
		
		console.log("add page");

		var $target = $(e.target);
		var pageRange = $target.val();

		if ( texttvapp.helpers.isValidPageRange(pageRange)) {
		
			console.log("valid range!");
			var newPageData = {
				pageRange: pageRange
			};
			
			this.$el.find(".FavsItems").append( this.template_single( newPageData ) );

			$target.val("");

		}

	},

	askToRemoveItem: function(e) {

		var $target = $(e.target);
		var $li = $target.closest("li");
		var pageRange = $li.data("pagerange");
		confirm("Ta bort "  + pageRange + " från favoriter?");
		e.stopPropagation();

	},

	makeSortable : function() {
	
		var FavsItems = document.querySelector("#FavsItems");

		if (FavsItems) {
		
			new Sortable(FavsItems, {
				handle: ".FavsItem-draggable",
				onUpdate: function (evt){
					var itemEl = evt.item; // the current dragged HTMLElement
					console.log(itemEl);
				},

			});
		}
	},

	render: function() {

		var self = this;
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

			var $elm = $("#SidebarFavs");
			$elm.html( self.template( { pages: pages } ) );

		});

	}

});

texttvapp.favsView = new FavsView({
	el: "#SidebarFavs",
	model: FavsModel
});


function onDeviceReady() {

	/*
	https://github.com/danwilson/google-analytics-plugin
	To track a Screen (PageView):

	analytics.trackView('Screen Title')
	To track an Event:

	analytics.trackEvent('Category', 'Action', 'Label', Value) Label and Value are optional, Value is numeric
	*/

	// Init Google Analytics
	analytics.startTrackerWithId("UA-181460-25");
	analytics.trackView('Start app');

	// navigator.splashscreen.show();
	// Add classes to body depending on current device
	var css_platform = "platform-" + device.platform.toLowerCase() + parseInt(device.version);
	document.querySelector("body").classList.add(css_platform, "platform-cordova");

	navigator.splashscreen.hide();

	/*
	statusbar = navigator.statusBar;
	alert(statusbar);
	statusbar.hide();
	statusbar.show();

	setTimeout(function() {
		statusbar.whiteTint();
	}, 1000);
	setTimeout(function() {
		statusbar.blackTint();
	}, 2000);

	setTimeout(function() {
		statusbar.hide();
	}, 3000);

	*/


}
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceResume() {
	analytics.trackEvent('App', 'Resume');
}
document.addEventListener("resume", onDeviceResume, false);

/**
 * Scroll to top when tap on status bar
 * Some ideas here:
 * http://www.tricedesigns.com/2013/10/08/status-tapscroll-to-top-in-phonegap-apps-on-ios/
 */
window.addEventListener("statusTap", function() {

	$elmToScroll = $(".swiper-slide-active");

	// disable touch scroll to kill existing inertial movement
	$elmToScroll.css({
		'-webkit-overflow-scrolling' : 'auto',
	});

	$elmToScroll.animate({ scrollTop: 0 }, 300, "swing", function() {

		// re-enable touch scrolling
		$elmToScroll.css({
			'-webkit-overflow-scrolling' : 'touch',
		});

	});

});

window.addEventListener('load', function() {

	// Add fastclick
	FastClick.attach(document.body);

	// when sidebar is open and tap on main view = close sidebar
	$(document).on("click", ".view--main.open-sidebar", function(e) {

		var $target = $(e.target);
		
		// dont show/hide if clicked elm is .js-sidebarToggle, i.e. the icon that toggles the nav = inception!
		if ( $target.is(".js-sidebarToggle") ) {
			return true;
		}

		// Hide sidebar
		texttvapp.sidebarView.close();

	});

}, false);

