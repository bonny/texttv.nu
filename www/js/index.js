/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

		// Application Constructor
		initialize: function() {
				this.bindEvents();
				//this.startTextTV();
		},
		// Bind Event Listeners
		//
		// Bind any events that are required on startup. Common events are:
		// 'load', 'deviceready', 'offline', and 'online'.
		bindEvents: function() {
				document.addEventListener('deviceready', this.onDeviceReady, false);
		},
		// deviceready Event Handler
		//
		// The scope of 'this' is the event. In order to call the 'receivedEvent'
		// function, we must explicity call 'app.receivedEvent(...);'
		onDeviceReady: function() {
			//app.receivedEvent('deviceready');
			// window.plugins.tapToScroll.initListener();

			texttv.init();
			/*
			// bug: only works on double tap for me
			window.addEventListener("statusTap", function() {
				alert("status tap");
			});
			*/

		},
		// Update DOM on a Received Event
		receivedEvent: function(id) {
				/*
				var parentElement = document.getElementById(id);
				var listeningElement = parentElement.querySelector('.listening');
				var receivedElement = parentElement.querySelector('.received');

				listeningElement.setAttribute('style', 'display:none;');
				receivedElement.setAttribute('style', 'display:block;');

				console.log('Received Event: ' + id);
				*/
		}
};






/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
 (function($) {
		 
		$.fn.alterClass = function(removals, additions) {
		
			var self = this;
			
			if (removals.indexOf('*') === -1) {
			// Use native jQuery methods if there is no wildcard matching
			self.removeClass(removals);
			return !additions ? self : self.addClass(additions);
			}

			var patt = new RegExp('\\s' + removals.
														replace(/\*/g, '[A-Za-z0-9-_]+').
														split(' ').
														join('\\s|\\s') + '\\s', 'g');
			 
			self.each(function(i, it) {
								var cn = ' ' + it.className + ' ';
								while (patt.test(cn)) {
								cn = cn.replace(patt, ' ');
								}
								it.className = $.trim(cn);
								});
			 
			return !additions ? self : self.addClass(additions);
		};
		 
})(jQuery);



$.mobile.page.prototype.options.keepNative = "select, input, textarea, button";
$.event.special.tap.tapholdThreshold = 300;

/**
 * Modul som håller koll på stjärnmärkasidor
 * Sidor lagras i local storage
 */
var texttv_stars = (function() {

	var module = {},
		starredPages = {};

	function loadStarredPages() {

		starredPages = localStorage.getItem("starredPages");
		if (starredPages) {
			starredPages = JSON.parse(starredPages);
			if (starredPages instanceof Array === false) {
				// should be an array, but it's not. reset it
				starredPages = [];
			}
		} else {
			starredPages = [];
		}

	}

	function setStarredPages(objPages) {
		
		starredPages = objPages;
		saveStarredPages();

	}

	function getStarredPages() {
		
		return starredPages;

	}

	function starPage(pageRange) {
	
		starredPages.push("" + pageRange);
		saveStarredPages();
	
		ga_storage._trackEvent('stars', 'starred', pageRange);
	
	}

	function unStarPage(pageRange) {

		var pos = $.inArray("" + pageRange, starredPages);
		starredPages.splice(pos, 1);
		saveStarredPages();

		ga_storage._trackEvent('stars', 'unstarred', pageRange);

	}

	function isPageStarred(pageRange) {

		return $.inArray("" + pageRange, starredPages) !== -1 ? true : false;
	}

	function saveStarredPages() {

		localStorage.setItem("starredPages", JSON.stringify(starredPages));

	}

	module.toggleStarPage = function(pageRange) {

		//console.log("toggle" + pageRange);
		pageRange = "" + pageRange;
		if ( isPageStarred(pageRange) ) {
			// console.log("page was starred, unstarring it");
			unStarPage(pageRange);

		} else {
			// console.log("page is not starred, so starring it");
			starPage(pageRange);
		}

		// saveStarredPages();

	};

	module.isPageStarred = isPageStarred;
	module.getStarredPages = getStarredPages;
	module.setStarredPages = setStarredPages;
	module.saveStarredPages = saveStarredPages;
	module.unStarPage = unStarPage;

	module.init = function() {
		loadStarredPages();
	};

	return module;

});

/**
 * Huvudmodul för texttv.nu-appen
 * Sköter hämtning av sidor, rendering av templates, navigation osv.
 */
var texttv = (function() {

	var module = {
		ajaxurl: "http://texttv.nu/api/get/",
		pages: $("#output_pages"),
		template_pages: $("#tmpl_pages").html(),
		template_textpage: $("#tmpl_textpage").html(),
		body: $(document.body),
		history: [],
		starred_pages: new texttv_stars(),
		pageCurrent: null,
		pageCurrentRange: null
	};

	module.init = function() {

		module.addListeners();
		module.starred_pages.init();

		texttv.loadPage("100", {
			title: "100",
			pageClass: "page-is-home"
		});

	};

	module.initPullToRelease = function() {

		$('.scrollable').pullToRefresh({
			callback: function() {
				var def = $.Deferred();
				
				/*setTimeout(function() {
					alert("yeah");
					def.resolve();
				}, 3000); */

				// def.resolve();
				setTimeout(function() {

					module.loadPage(module.pageCurrentRange, { isReload: true });
					def.resolve();

				}, 0);

				return def.promise();
			}
		});

	};

	/*
	args: {
		direction: forward | back
		isReload false | true
	}
	*/
	module.loadPage = function(pageRange, args) {

		var opts = {
			direction: "forward",
			isReload: false
		};
		args = $.extend(opts, args);

		module.hideMessage();
		
		var loadingClass = "";
		if (opts.isReload === true) {
			loadingClass = "reload";
		} else {
			loadingClass = opts.direction;
		}
		module.body.addClass("is-loading-page is-loading-page-" + loadingClass);

		var div_new_article = $("<article />"),
			url = module.ajaxurl + pageRange + "?jsoncallback=?";

		module.pages.append(div_new_article);

		// if the input for page num entering is focued, then unfocus it
		// it's not perfect because the nav system will go to the page in the input 
		// and not the clicked pagerange
		// and the trigger does not send its additional arguments to blur method
		// due to a jquery bug:
		// http://bugs.jquery.com/ticket/13428
		// TODO: fix this when jquery bug is fixed
		var focused_input = $(".nav-current input:focus");
		if ( focused_input.length ) {
			focused_input.trigger("blur", { "originFunction": "loadPage" });
		}

		$.getJSON(url, function(data) {
							
			// Page is loaded from server
			
			// Determine prev page link (upper left corner)
			var prevPageRange = null,
				prevPage = null;
			
			// Add the page(s) we just loaded to history
			if (! args.isReload) {
				module.history.push({
					pageRange: pageRange,
					pageTitle: opts.title,
					pageClass: opts.pageClass
				});
			}
			
			// The prev link is simple the item before the one we added
			if (module.history.length > 1) {
				prevPageRange = module.history[module.history.length-2].pageRange;
				prevPage = module.history[module.history.length-2];
			}
			
			// If moving backwards then the last item
			// should be removed
			// because we're not going forward to page n,
			// we are going *back* to page n
			if ("back" == opts.direction) {
			
				// but only if length is more than 1, because we may have removed all history = gone all the way back
				if (module.history.length > 2) {

					module.history = module.history.slice(0, module.history.length-2);
					// re-calculate back-link
					// console.log("history before back recalc", module.history);
					if (module.history.length > 1) {
						prevPageRange = module.history[module.history.length-2].pageRange;
						prevPage = module.history[module.history.length-2];
					} else {
						prevPageRange = null;
						prevPage = null;
					}
				
				}
			}
			
			//console.log("history is", module.history);
			module.pageCurrent = data;
			module.pageCurrentRange = pageRange;
			var templateData = {
				pages: data,
				pageRange: pageRange,
				prevPageRange: prevPageRange,
				prevPage: prevPage,
				pageIsStarred: module.starred_pages.isPageStarred(pageRange),
				pageTitle: opts.title
			};
			
			var rendered_article = $(_.template(module.template_pages, templateData));
			
			// Set page class state
			// module.body.removeClass("page-is-home page-is-favs page-is-settings page-is-menu");
			module.body.alterClass("page-is-*");

			if (args.pageClass) {
				rendered_article.addClass( args.pageClass );
				module.body.addClass( args.pageClass );
			}
															
			// if loaded is favs, but favs are empty
			if (args.pageClass && args.pageClass == "page-is-favs" && pageRange === "") {
				rendered_article.addClass("favs-is-empty");
				module.showMessage("Här kommer de sidor du markerar som favorit dyka upp.");
			}
			
			div_new_article.replaceWith( rendered_article );
			
			setTimeout(function() {
								 
				// remove class and new page will be visible
				module.body.alterClass("is-loading-page is-loading-page-*");

				// Existing articles
				var articles = module.pages.find("article");
				articles.removeClass("is-frontmost");

				rendered_article.addClass("is-frontmost");

				// If more than one article then prev-nav should exist
				if (articles.length > 1) {
					module.body.addClass("has-prev-page");
				}

				// If more than 2 article elm exists we remove the first ones, only 2 shall be in dom
				if (articles.length > 2) {
					articles.slice(0, articles.length-2).remove();
				}

				module.initPullToRelease();

				ga_storage._trackPageview(pageRange);

			}, 0); // timeout

			}, function() {}).error(function(data) {
				// There was an error in the JSON file
				alert("Kunde inte ladda sidan. Försök igen om en stund.");
			}); // ajax get
			
		}; // load page

	module.addListeners = function() {

		var clickevent = "tap";
		
		$(document).on(clickevent, ".nav-prev button", module.navPrev);
		$(document).on(clickevent, ".nav-home button", module.navHome);
		$(document).on(clickevent, ".page-content a", module.navInsidePageContent);
		$(document).on(clickevent, ".nav-star button", module.clickStar);
		$(document).on(clickevent, ".nav-about button", module.navAbout);
		$(document).on(clickevent, ".nav-stars button", module.clickNavStars);
		$(document).on(clickevent, ".nav-star-change button", module.showStarredPagesEdit);
		$(document).on(clickevent, ".nav-page-prev button", module.navPagePrev);
		$(document).on(clickevent, ".nav-page-next button", module.navPageNext);

		// have problems with tap and vclick on this list
		$(document).on("click", ".nav-star-change-pages li .icon-minus-sign", module.clickStarRemove);
		
		$(document).on("tap", "article.page-is-favs-edit .page-content", module.clickStarredPagesEditArticle);
		$(document).on("tap", ".has-message #output_pages", module.hideMessage);
		
		$(document).on("swipeleft", ".page-content", module.swipe);
		$(document).on("swiperight", ".page-content", module.swipe);
		
		$(document).on("focus", ".nav-current input", module.focusCurrent);
		$(document).on("blur", ".nav-current input", module.blurCurrent);
		
		$(document).on("keyup", ".nav-current input", module.keyupCurrent);

		// Links that should open in built in browser
		$(document).on("click", "a[target='_system']", module.openURLInAppBrowser);

		// share button
		$(document).on(clickevent, ".nav-share button", module.socialShare);

	};

	module.openURLInAppBrowser = function(e) {
		
		e.preventDefault();
		
		var t = $(this),
			ref = window.open(t.attr("href"), "_system");

	};

	// CLick on article when starred pages is visible = hide the starred pages
	module.clickStarredPagesEditArticle = function(e) {

		// pass this
		module.showStarredPagesEdit.apply(this);

	};

	// Swipe!
	module.swipe = function(e, data) {

		if (!module.pageCurrent) return;

		var pageRange = null,
			dir = null;

		if ("swipeleft" === e.type) {

			pageRange = module.pageCurrent[0].next_page;

		} else if ("swiperight" === e.type) {

			pageRange = module.pageCurrent[0].prev_page;
			dir = "back";

		}

		module.loadPage(pageRange, {
			direction: dir
		});

		ga_storage._trackEvent('nav', 'swipe', dir);

	};

	// Show starred pages
	module.clickNavStars = function(e) {
		
		var pages = module.starred_pages.getStarredPages();
		// console.log(pages);
		var str_pages = "";
		_.each(pages, function(value, key, list) {
			str_pages += value+ ",";
		});
		
		module.loadPage(str_pages, {
			title: "Favoriter",
			pageClass: "page-is-favs"
		});
		
	};


	/**
	 * click star in upper right corner
	 * add or remove the current page(s)
	 */
	module.clickStar = function(e) {

		e.stopPropagation();

		var t = $(this),
			i = t.find("i"),
			pageRange = parseInt(t.closest("article").data("pagerange"), 0);

		module.body.removeClass("star-animation-add-start star-animation-remove-start star-animation-add-end star-animation-remove-end");

		module.starred_pages.toggleStarPage(pageRange);
		i.attr("class", "");
		
		var endClass;
		if ( module.starred_pages.isPageStarred(pageRange) ) {
		
			i.addClass("icon-star");
			module.body.addClass("star-animation-add-start");
			endClass = "star-animation-add-end";

		} else {
		
			i.addClass("icon-star-empty");
			module.body.addClass("star-animation-remove-start");
			endClass = "star-animation-remove-end";
		
		}

		setTimeout(function() {
			module.body.addClass(endClass);
		}, 0);



	};

	module.navInsidePageContent = function(e) {

		e.preventDefault();

		var a = $(this),
			href = a.attr("href");

		href = href.replace("/", "");
		module.loadPage(href);

	};

	module.navHome = function() {

		// clear history, so it feels like a new start
		module.history.length = 0;
		module.loadPage(100, {
			direction: "back",
			pageClass: "page-is-home"
			// title: "Hem"
		});

		ga_storage._trackEvent('nav', 'navigate', 'home');

	};

	/**
	 * Go to previous page = fetch previous page from history
	 */
	module.navPrev = function(e) {

		e.stopPropagation();
		e.preventDefault();
		var prevPage = module.history[ module.history.length-2 ];

		module.loadPage(prevPage.pageRange, {
			direction: "back",
			title: prevPage.pageTitle,
			pageClass: prevPage.pageClass
		});

		ga_storage._trackEvent('nav', 'navigate', 'prev');

	};

	/**
	 * Go to prev page by number
	 * Used from buttons in bottom nav
	 */
	module.navPagePrev = function(e) {

		e.stopPropagation();
		e.preventDefault();

		console.log("module.pageCurrent", module.pageCurrent[0]);
		var prevPage = module.pageCurrent[0].prev_page;
		module.loadPage(prevPage, {
			direction: "back"
		});

		ga_storage._trackEvent('nav', 'navigate', 'page prev');

	};

	/**
	 * Go to next page by number
	 * Used from buttons in bottom nav
	 */
	module.navPageNext = function(e) {

		e.stopPropagation();
		e.preventDefault();

		console.log("module.pageCurrent.next_page");
		console.log(module.pageCurrent[0].next_page);
		var nextPage = module.pageCurrent[0].next_page;
		module.loadPage(nextPage, {});

		ga_storage._trackEvent('nav', 'navigate', 'page next');

	};


	module.showStarredPagesEdit = function(e) {

		// output starred pages in settings-wrench-thingie
		// nav-star-change

		var t = $(this),
			article = t.closest("article");

		// Show or hide favs edit?
		if (article.hasClass("page-is-favs-edit")) {
			article.removeClass("page-is-favs-edit");
			ga_storage._trackEvent('stars', 'edit', 'hide');
			return;
		}

		article.addClass("page-is-favs-edit");

		var pages = module.starred_pages.getStarredPages(),
			elm = $(".nav-star-change-pages-list");
			str = "";

		str += "<ul>";
		_.each(pages, function(pageNum, i, index){

			str += "<li data-pagerange='"+pageNum+"'>";
			str += pageNum;
			str += "<i class='icon-minus-sign'></i>";
			str += "<i class='icon-reorder'></i>";
			str += "</li>";

		});

		str += "</ul>";
		elm.html(str);

		elm.find("ul").sortable({
			axis: "y",
			handle: ".icon-reorder",
			revert: 200,
			containment: "parent",
			tolerance: "pointer",
			stop: function(event, ui) {
				// sorting is done, get and save new order
				var ul = $(event.target),
					arrStarredPages = [];
				ul.find("li").each(function(i, elm) {
				
					elm = $(elm);
					var pageRange = "" + elm.data("pagerange");
					arrStarredPages.push( pageRange );

				});

				module.starred_pages.setStarredPages(arrStarredPages);

			}
		}); // sortable

		ga_storage._trackEvent('stars', 'edit', 'show');

	}; // showStarredPagesEdit

	module.clickStarRemove = function(e) {

		var t = $(this),
			li = t.closest("li"),
			pageRange = li.data("pagerange");

		if ( confirm("Ta bort " + pageRange + " från favoriter?") ) {

			module.starred_pages.unStarPage(pageRange);

			li.slideUp("fast", function(e) {
				li.remove();
			});

		} // if

	}; // func

	module.showMessage = function(msg) {

		var msg_elm = $("#message-content");
		msg_elm.html(msg);
		module.body.addClass("has-message");

	};

	module.hideMessage = function() {
		module.body.removeClass("has-message");
	};

	module.navAbout = function() {

		// Just return if we already are at this page
		if (module.body.hasClass("page-is-text")) return;

		var str = "";
		str += "<p>Vi på texttv.nu har som mål att göra den bästa sajten &amp; appen för SVT Text TV.</p>";
		str += "<p>Besök vår sajt som fungerar både i mobiler och på din dator: <a target='_system' href='http://texttv.nu/?utm_source=app-texttv&utm_medium=page&utm_campaign=about'>texttv.nu</a></p>";
		str += "<p>Följ oss gärna på Twitter: <a target='_system' href='https://twitter.com/TextTV_nu'>@texttv_nu</a></p>";
		str += '<p>Den här appen är skapad av <a target="_system" href="http://mufflify.com/?utm_source=app-texttv&utm_medium=page&utm_campaign=about">Mufflify</a>.</p>';
		str += "<p>TextTV.nu-appen hade inte varit möjlig att göra utan dessa tredjepartskomponenter:</p>";
		str += "<p>PhoneGap, Copyright (c) 2013 Adobe Systems Inc. </p>";
		str += "<p>jQuery alterClass plugin, Copyright (c) 2011 Pete Boere (the-echoplex.net)";
		str += "<p>Font Awesome by Dave Gandy";

		var templateData = {
			textContent: str,
			textTitle: "Om Appen"
		};

		module.body.alterClass("page-is-* has-message", "page-is-text");

		var rendered_article = $(_.template(module.template_textpage, templateData));
		module.pages.append(rendered_article);

		ga_storage._trackEvent('nav', 'navigate', 'about');

	};


	/**
	 * Click input = show ok-button
	 */
	module.focusCurrent = function(e) {
		
		var t = $(this);
			e.preventDefault();

		if (! t.data("prevNumber")) {
			t.data("prevNumber", t.val());
		}

		// Change type so correct keyboard will appear
		t.attr("type", "number");

		t.val("");

	};

	module.blurCurrent = function(e, data, datab) {

		/*
		only continue if blur came from input, and input was not called beacuse click on link or similar
		originalEvent: tom om riktiga input
		relatedTarget:null | div.ui-page-active om inte direkt från input
		target: input
		*/
		//alert(e.originalEvent); // object om riktig | undefined om triggad
		//console.log(data);
		//console.log(datab);

		var t = $(this),
			article = t.closest("article"),
			input = article.find(".nav-current input"),
			pageRange = input.val();

		if (pageRange === "") {
			t.val( t.data("prevNumber") );
		}

		if (pageRange) {
			module.loadPage(pageRange);
		}

		ga_storage._trackEvent('nav', 'navigate', 'manual', pageRange);

	};


	module.keyupCurrent = function(e) {
		
		if (e.keyCode === 13) {
			this.blur();
		}
		
	};

	/**
	 * Share current pagerange using social share plugin
	 */
	module.socialShare = function() {

		// Check that  plugin is available (only ios >= 6)
		window.plugins.social.available(function(avail) {
		
			if (avail) {
				
				// console.log(module.pageCurrentRange);

				var ids = [];
				for (var page in module.pageCurrent) {
					//console.log( module.pageCurrent[ page ] );
					// console.log( JSON.stringify( module.pageCurrent[ page ] ) );
					ids.push( module.pageCurrent[ page ]["id"] );
				}
				var str_ids = ids.join(",");

				var imageULR = "http://texttv.nu/images/46233806014.png";
				var pageURL = "http://texttv.nu/" + module.pageCurrentRange + "/arkiv/delat/" + str_ids;
				
				var message = "";
				if (ids.length === 1) {
					message += "Text TV sida " + module.pageCurrentRange + ": " + pageURL;
				} else {
					message += "Text TV sidorna " + module.pageCurrentRange + ": " + pageURL;
				}
				message += " (Delat från TextTV.nu)";

				window.plugins.social.share(message, pageURL, imageULR);

			} else {
				// alert("can not use social plugin");
			}
		});

	};

	return module;

})();
