
/**
 * Favs model
 */
var FavsModel = Backbone.Model.extend({

	defaults: {
		favs: {}
	},

	getAsPageRangeArray: function() {

		var arrPageRanges = [];
		_.each( this.get("favs").pages, function(item) {
			arrPageRanges.push(item.pageRange);
		} );

		return arrPageRanges;

	},


});

var FavsView = Backbone.View.extend({

	template: _.template( $("#FavsTemplate").html() ),
	template_single: _.template( $("#FavsItemTemplate").html() ),

	events: {
		"click .FavsItemEdit": "beginEdit",
		"click .FavsItemEditDone": "endEdit",
		"click .FavsItem-remove": "askToRemoveItem",
		"keyup .sidebar-input-favitem-add": "inputChange",
	},

	initialize: function() {

		this.loadFavs();
		this.render();
		this.makeSortable();

	},

	// can be used in console to clear favs
	// in console: texttvapp.favsView.clearFavs();
	clearFavs: function() {
		
		var favs = {
			key: "favs",
			pages: []
		};

		texttvapp.storage.save(favs, function(favs) {
			// after favs saved
			console.log("favs saved and cleared");
		});

	},

	loadFavs: function() {

		var self = this;
		texttvapp.storage.get("favs", function(favs) {

			// console.log("loaded favs", favs);

			// Make sure at least one page exists, so user has something to start with
			if ( _.isEmpty(favs.pages) ) {
				
				favs.pages = [];
				favs.pages.push({
					pageRange: 100
				});
			}

			self.model.set("favs", favs);

		});

	},

	beginEdit: function() {
		this.$el.addClass("is-editing");

		analytics.trackEvent('App', 'Favs', "StartChange");

	},

	// save favs when editing is done
	endEdit: function() {
	
		this.$el.removeClass("is-editing");

		var self = this;
		var items = this.$el.find(".FavsItems .item-texttvpage");
		var favs = {
			key: "favs",
			pages: []
		};
		_.each(items, function(item) {
			var pageRange = item.dataset.pagerange;
			favs.pages.push({
				pageRange: pageRange
			});
		});

		texttvapp.storage.save(favs, function(favs) {
			// after favs saved
			console.log("favs saved");
			
			// Reload to populate
			self.loadFavs();

		});

		analytics.trackEvent('App', 'Favs', "EndChange");

	},

	inputChange: function(e) {
		
		var $target = $(e.target);
		var pageRange = $target.val();

		if ( texttvapp.helpers.isValidPageRange(pageRange)) {
		
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
		
		if ( confirm("Ta bort "  + pageRange + " från favoriter?") ) {

			$li.fadeOut("slow", function() {

				$li.remove();
				
			});

		}


		e.stopPropagation();

	},

	makeSortable : function() {
	
		var FavsItems = document.querySelector("#FavsItems");

		if (FavsItems) {
		
			new Sortable(FavsItems, {
				handle: ".FavsItem-draggable",
				onUpdate: function (evt){
					/*var itemEl = evt.item; // the current dragged HTMLElement
					console.log(itemEl);*/
				},

			});

			// Disable sidebar scrolling when draging
			$(document).on("touchstart", "#SidebarFavs.is-editing .item-texttvpage", function(e) {

				texttvapp.sidebarView.$el.find(".scroll-content").css({
					overflowY: "hidden"
				});

			});

			$(document).on("touchend", "#SidebarFavs.is-editing .item-texttvpage", function() {

				texttvapp.sidebarView.$el.find(".scroll-content").css({
					overflowY: "scroll"
				});

			});

		}
	},

	render: function() {

		var self = this;	
		var favs = this.model.get("favs");
		var pages = favs.pages;
		var $elm = $("#SidebarFavs");
		$elm.html( self.template( { pages: pages } ) );

	}

});

// Add favs to texttv
texttvapp.favs = new FavsModel();

texttvapp.favsView = new FavsView({
	el: "#SidebarFavs",
	model: texttvapp.favs
});

