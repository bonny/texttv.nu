
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

		// console.log("pageRange", pageRange);
		texttvapp.TextTVPages.add( new texttvapp.textTVPage({ pageRange: pageRange }) );

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
		sourceData: null
	},

	initialize: function() {
		
		this.on("change:pageRange", this.loadPageRange);

		// Load pagerange directly if set on init
		if ( this.has("pageRange") ) {
			this.loadPageRange();
		}

	},


	loadPageRange: function() {

		$.ajax({
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
		"click .js-sidebarToggle": "toggleSidebar"
	},

	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
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

texttvapp.mainView = new MainView({
	model: texttvapp.mainModel
});

