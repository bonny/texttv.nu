
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
		
		console.log("Open or close sidebar in sidebar view");
		this.model.set("isOpen", !this.model.get("isOpen"));

	},

	render: function() {
		console.log("Render sidebarView");
		return this;

	},

	itemClick: function(e) {
		e.preventDefault();
		console.log("click sidebar page range");
		var $item = $(e.target);
		var pageRange = $item.data("pagerange");
		console.log("pageRange", pageRange);
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

});

texttvapp.textTVPageModel = new TextTVPageModel();

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
		console.log("Open or close sidebar in main view");
		texttvapp.sidebarView.toggle();
	},

	render: function() {
		console.log("Render mainView");
		var renderedHTML = this.template( this.model.attributes );
		this.$el.html(renderedHTML);
		return this;
	}

});

texttvapp.mainView = new MainView({
	model: texttvapp.mainModel
});

