(function($) { 'use strict';

	$(document).ready(function($){

		// Calculate clients viewport

		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Retina Logo

		if($('.retina-logo img').length){
			var retinaImage = $('.retina-logo img');

			var imageLoaded = function () {
				var theImage = new Image();

				theImage.src = retinaImage.attr('src');

				var imageWidth = theImage.width;

				retinaImage.width(imageWidth / 2);
			};

			retinaImage.each(function() {
				if( this.complete ) {
					imageLoaded.call( this );
				} else {
					$(this).one('load', imageLoaded);
				}
			});
		}

		// Main Menu

		// dropdown button

		var mainMenuDropdownLink = $('.nav-menu > .menu-item-has-children > a, .nav-menu > .page_item_has_children > a');
		var dropDownArrow = $('<a href="#" class="dropdown-toggle"><span class="screen-reader-text">toggle child menu</span>+</a>');

		mainMenuDropdownLink.after(dropDownArrow);

		// dropdown open on click

		var dropDownButton = mainMenuDropdownLink.next('a.dropdown-toggle');

		if(x <= 1024){
			dropDownButton.on('click', function(e){
				e.preventDefault();
				var $this = $(this);
				$this.parent('li').toggleClass('toggle-on');
			});
		}

		// dropdown stay open when child is current item

		var openSubMenu = function() {
			$('.current-menu-item, .current-page-item').parents('.sub-menu').css({
				opacity: 1,
				visibility: 'visible',
				height: 'auto',
				padding: '10px 0'
			});
		};

		if ( x > 1024) {
			openSubMenu();
		} else {
			openSubMenu();
			$('.current-menu-item, .current-page-item').parents('.menu-item-has-children').addClass('toggle-on');
		}

		// Big Search Form

		var body = $('body');
		var bigSearchWrap = $('div.search-big');
		var bigSearchTrigger = $('a.search-big__trigger');
		var bigSearchClose = $('a.search-big__close');
		var bigSearchTextInput = bigSearchWrap.find('.search-field');

		bigSearchTextInput.attr('data-swplive', 'true');
		bigSearchTextInput.attr('data-swpengine', 'default');
		bigSearchTextInput.attr('data-swpconfig', 'default');

		body.on('click touchstart', function(){
			$(this).removeClass('big-search-opened');
			bigSearchWrap.find('.search-field').blur();
		});

		bigSearchWrap.on('click touchstart', function(e){
			e.stopPropagation();
		});

		bigSearchTrigger.on('click touchstart', function(e){
			e.preventDefault();
			e.stopPropagation();
			body.toggleClass('big-search-opened');
			$(this).prev('.search-big').find('.search-field').focus();
		});

		bigSearchClose.on('click touchstart', function(e){
			e.preventDefault();
			body.removeClass('big-search-opened');
			$(this).prev('.search-big').find('.search-field').blur();
		});

		// Calculate top offset of big search buttons relative to header height

		var headerHeight = $('#masthead').outerHeight();

		if(x > 782 && x < 1025){
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', (headerHeight / 2 + 21)).show();
			}
			else{
				bigSearchTrigger.css('top', (headerHeight / 2 - 11)).show();
			}
		}
		else if(x > 767 && x <= 782){
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', (headerHeight / 2 + 35)).show();
			}
			else{
				bigSearchTrigger.css('top', (headerHeight / 2 - 11)).show();
			}
		}
		else if(x <= 767){
			bigSearchTrigger.css('top', (headerHeight / 2)).show();
		}
		else{
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', 84).show();
			}
			else{
				bigSearchTrigger.css('top', 49).show();
			}
		}

		// Fancybox

		$('.fancybox').fancybox({
			openOpacity: false,
			closeOpacity: false,
			openEffect: 'none',
			closeEffect: 'none',
			openSpeed: 0,
			closeSpeed: 0,
			helpers: {
				media: {}
			}
		});



		// Show gallery on top on gallery archives if user inserted it

		var galleryArchivePost = $('.home article.format-gallery, .archive article.format-gallery, .search article.format-gallery, .index article.format-gallery');

		// If is gallery archive page

		if(galleryArchivePost.length){

			galleryArchivePost.each(function(){

				var gallery_tiled = $(this).find('.tiled-gallery');
				var gallery_row = $(this).find('.gallery-item');
				var featured_container = $(this).find('.featured-image');
				var gallery_wrapper;

				if(gallery_tiled.length){
					gallery_wrapper = gallery_tiled;
				}
				else if(gallery_row.length) {
					gallery_wrapper = gallery_row.parent();
				}
				else {
					gallery_wrapper = 'no-gallery';
				}

				if(gallery_wrapper != 'no-gallery'){
					$(this).prepend(gallery_wrapper.clone());
					gallery_wrapper.empty();
					if(featured_container.length){
						featured_container.hide();
					}
				}

			});

		}

		// Primary menu for touch devices

		var primaryMenuToggle = $('button.menu-toggle');

		primaryMenuToggle.on('click', function(){
			var primaryMenu = $('#site-navigation');
			if(primaryMenu.hasClass('toggled')){
				body.addClass('main-nav-opened');
			}
			else{
				body.removeClass('main-nav-opened');
			}
		});

		// Featured image position depending on its orientation

		var singleFeaturedImg = $('body.single').find('figure.featured-image');
		var portraitSibling = $('body.single').find('.entry-content > :first-child :first-child');
		var featuredImagePortrait = $('figure.featured-portrait');

		if(body.hasClass('single') && featuredImagePortrait.length && !portraitSibling.is('img, video, iframe, .gallery-group')){
			$('.entry-content > :first-child').prepend(singleFeaturedImg);
		}
		else if(featuredImagePortrait.length){
			featuredImagePortrait.show();
		}

		// Grid Infinite Scroll

		var $container = $('div.grid-wrapper');
		var loadingImg = js_vars.url+'/theme-images/spinner.gif';

		$container.infinitescroll({
			navSelector  : '#infinite-handle',    // selector for the paged navigation
			nextSelector : '#infinite-handle a',  // selector for the NEXT link (to page 2)
			itemSelector : '.post',
			loading: {
				finishedMsg: 'No more posts to load.',
				msgText: '',
				img: loadingImg,
				selector: '#loading-is'
			}
		},
		function() {
			// Reactivate masonry on post load

			var newEl = $container.children().not('article.post-loaded, span.infinite-loader, nav.posts-navigation, #loading-is').addClass('post-loaded');

			newEl.hide();
			newEl.imagesLoaded(function () {

				setTimeout(function(){
					$container.addClass('infinite').masonry('appended', newEl, true).masonry('reloadItems').masonry('layout').resize();
				}, 500);
				$('#infinite-handle').show();

				newEl.each(function(){
					var $this = $(this);

					if($this.find('iframe').length){
						var $iframe = $this.find('iframe');
						var $iframeSrc = $iframe.attr('src');

						$iframe.load($iframeSrc, function(){
							$container.masonry('layout');
						});
					}

					var wScrollTop = $(window).scrollTop();
					if(x >= 992){
						if(wScrollTop > $this.offset().top - ($(window).height() / 1.1)){
							$this.addClass('animate');
						}
					}
					else{
						if(wScrollTop > $this.offset().top - ($(window).height() / 1.2)){
							$this.addClass('animate');
						}
					}
				});

				$(window).scroll(function(){
					var wScrollTop = $(window).scrollTop();
					newEl.each(function(){
						var $this = $(this);
						if(x >= 992){
							if(wScrollTop > $this.offset().top - ($(window).height() / 1.1)){
								$this.addClass('animate');
							}
						}
						else{
							if(wScrollTop > $this.offset().top - ($(window).height() / 1.2)){
								$this.addClass('animate');
							}
						}
					});
				});

				// Format image

				// find post format image link
				var post_image_link = $('.grid-wrapper .format-image figure.featured-image a');

				if(x < 768){
					// remove thickbox class and replace href with post permalink
					post_image_link.removeClass('thickbox');

					post_image_link.each(function(){

						var $this = $(this);

						// Get permalink from data attr and content class
						var post_permalink = $this.data('post_url');

						if($this.hasClass('no-content')){
							$this.find('img').unwrap();
						}
						else {
							$this.attr('href', post_permalink);
						}
					});

				}

				// set link on image post format for tablets
				if(x > 767 && x <= 1024){
					// remove thickbox class and replace href with post permalink
					post_image_link.each(function(){

						var $this = $(this);

						// Get permalink from data attr and content class
						var post_permalink = $this.data('post_url');

						if(!$this.hasClass('no-content')){
							$this.attr('href', post_permalink).removeClass('thickbox');
						}
					});
				}

				// on header and footer hover add class to featured image

				var imageFormatExcerptEl = $('.grid-wrapper .format-image header.entry-header, .grid-wrapper .format-image footer.entry-footer');

				imageFormatExcerptEl.on('mouseenter', function(){
					var $this = $(this);
					$this.parent().prev().addClass('hover');
				});

				imageFormatExcerptEl.on('mouseleave', function(){
					var $this = $(this);
					$this.parent().prev().removeClass('hover');
				});

			});
		});


		// If Infinite Scroll on click is choosen
		if ( js_vars.is_type == 'on-click' ) {

			//Onclick InfiniteScroll
			$(window).unbind('.infscr');

			$("#infinite-handle a").click(function(e){
				e.preventDefault();

				$container.infinitescroll('retrieve');
				return false;
			});

		}

		// On Infinite Scroll Load

		var infiniteHandle = $('.grid-wrapper #infinite-handle');

		if(infiniteHandle.length){
			if(x > 1024){
				infiniteHandle.closest('.grid-wrapper').css('margin-bottom', 154);
			}
			else{
				infiniteHandle.closest('.grid-wrapper').css('margin-bottom', 60);
			}
		}

		// Outline none on mousedown for focused elements

		body.on('mousedown', '*', function(e) {
			if (($(this).is(':focus') || $(this).is(e.target)) && $(this).css('outline-style') == 'none') {
				$(this).css('outline', 'none').on('blur', function() {
					$(this).off('blur').css('outline', '');
				});
			}
		});

		// Dropcap

		var dropcapEl = $('.dropcap');
		dropcapEl.parent().css({'z-index': 0, 'position': 'relative'});

		dropcapEl.each(function(){
			var $this = $(this);
			var dropcapLetter = $this.text();
			$this.prepend('<span class="dropcap__duplicate">'+dropcapLetter+'</span>');
		});

		// Category dropdown

		var catDropdownParent = $container.find('span.cat-links');

		catDropdownParent.each(function(){
			var catLinksVisibleElLast = $(this).find('a:eq(2)');
			var catLinksAllEl = $(this).find('a');
			if(catLinksAllEl.length > 3){
				catLinksVisibleElLast.addClass('more');
			}
		});

		// Forms

		var smallInput = $('.contact-form input[type="text"], .contact-form input[type="email"], .contact-form input[type="url"], .comment-form input[type="text"], .comment-form input[type="email"], .comment-form input[type="url"]');
		smallInput.parent().addClass('small-input');

		// Checkbox and Radio buttons

		//if buttons are inside label
		var checkBtn = $('label').find('input[type="checkbox"]');
		var checkLabel = checkBtn.parent('label');
		var radioBtn = $('label').find('input[type="radio"]');

		checkLabel.click(function(){
			var $this = $(this);
			if($this.find('input').is(':checked')){
				$this.addClass('checked');
			}
			else{
				$this.removeClass('checked');
			}
		});

		radioBtn.change(function(){
			var $this = $(this);
			if($this.is(':checked')){
				$this.parent('label').siblings().removeClass('checked');
				$this.parent('label').addClass('checked');
			}
			else{
				$this.parent('label').removeClass('checked');
			}
		});

		// Back to top

		if(x > 1024){
			var toTopArrow = $('a.back-to-top');
			var pagination = $('ul.page-numbers');

			toTopArrow.on('click touchstart', function (e) {
				e.preventDefault();
				$('html, body').animate({scrollTop: 0}, 800, 'swing');
				return false;
			});

			$(window).scroll(function () {
				var $this = $(this);
				if($this.scrollTop() > 600 && !pagination.length) {
					toTopArrow.fadeIn();
				}
				else{
					toTopArrow.fadeOut();
				}
			});
		}

		// Solutionn for IE when iframe loses hover event

		function getIEVersion() {
			var sAgent = window.navigator.userAgent;
			var Idx = sAgent.indexOf("MSIE");

			// If IE, return version number.
			if(Idx > 0){
				return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
			}

			// If IE 11 then look for Updated user agent string.
			else if(!!navigator.userAgent.match(/Trident\/7\./)){
				return 11;
			}
			else{
				return 0; //It is not IE
			}
		}

		if(getIEVersion() > 0){
			$('#sidebar').on('mouseenter', function() {
				$(this).addClass('hover');
			});
			$('#sidebar iframe').on('hover', function() {
				$(this).parents('#sidebar').addClass('hover');
			});
			$('#sidebar').on('mouseleave', function() {
				$(this).removeClass('hover');
			});
		}

		// Format image

		// find post format image link
		var post_image_link = $('.grid-wrapper .format-image figure.featured-image').find('a');

		if(x < 768){
			// remove thickbox class and replace href with post permalink
			post_image_link.removeClass('thickbox');

			post_image_link.each(function(){

				var $this = $(this);

				// Get permalink from data attr and content class
				var post_permalink = $this.data('post_url');

				if($this.hasClass('no-content')){
					$this.find('img').unwrap();
				}
				else {
					$this.attr('href', post_permalink);
				}
			});

		}

		// set link on image post format for tablets
		if(x > 767 && x <= 1024){
			// remove thickbox class and replace href with post permalink
			post_image_link.each(function(){

				var $this = $(this);

				// Get permalink from data attr and content class
				var post_permalink = $this.data('post_url');

				if(!$this.hasClass('no-content')){
					$this.attr('href', post_permalink).removeClass('thickbox');
				}
			});
		}

		// on header and footer hover add class to featured image

		var imageFormatExcerptEl = $('.grid-wrapper .format-image header.entry-header, .grid-wrapper .format-image footer.entry-footer');

		imageFormatExcerptEl.on('mouseenter', function(){
			var $this = $(this);
			$this.parent().prev().addClass('hover');
		});

		imageFormatExcerptEl.on('mouseleave', function(){
			var $this = $(this);
			$this.parent().prev().removeClass('hover');
		});

		// Remove post navigation if related posts is engaged

		var relatedPostsWidget = $('#jp-relatedposts');

		if(relatedPostsWidget.length){
			var postNavigation = $('nav.post-navigation');
			postNavigation.hide();
		}

		// Get Instagram name

		var instagramFollow = $('.null-instagram-feed > p > a');

		if(instagramFollow.length){
			var instagramFollowUrl = instagramFollow.attr('href').split('/');
			var instagramName = instagramFollowUrl[instagramFollowUrl.length - 2];

			instagramFollow.parent().append('<span class="instagram-name">@'+instagramName+'</span>');
		}

		// Change Newsletter input values

		var newsletterFormWrap = $('#newsleter-form-footer');

		if(newsletterFormWrap.length){
			var newsletterTextInput = newsletterFormWrap.find('input[type="text"]');
			var newsletterSubmitInput = newsletterFormWrap.find('input[type="submit"]');

			newsletterTextInput.attr('value', 'Email');
			newsletterSubmitInput.attr('value', 'Subscribe');
		}

		// Advertisement Widget

		var advertWidgetHalfWidthEven = $('.halfwidth-banner:even');

		advertWidgetHalfWidthEven.parent().addClass('first').next('.advertisement-widget').addClass('last');

		// Wrap half-width advertisement in groups for masonry

		if(x < 1280){
			var advertHalfWidth = $('.halfwidth-banner').parent().addClass('half');


			for(var i = 0; i < advertHalfWidth.length;) {
				i += advertHalfWidth.eq(i).nextUntil(':not(.half)').andSelf().wrapAll('<div class="advert-wrap"></div>').length;
			}
		}


	}); // End Document Ready

	$(window).load(function(){

		// Loader for post archive

		var archivePreloader = $('div.archive-loader');

		archivePreloader.fadeOut(400);

		// Calculate clients viewport

		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Preloader - show content

		var preload = function() {
			$('body').addClass('show');
		};

		setTimeout(function(){
			preload();
		}, 10);


		// Calculate height so main-navigatio dosn't overflow the footer

		if(x > 1024){
			var mainMenu = $('#site-navigation > div');
			if(mainMenu.length){
				var mainMenuOffsetTop = mainMenu.offset().top;
				var footerHeight = $('#colophon').outerHeight();
				var scrollFromTop = $(window).scrollTop();
				mainMenu.css('height', y - mainMenuOffsetTop + scrollFromTop - footerHeight - 50);
			}
		}

		// MCustomScrollbar for main menu

		var menuNav = $('#site-navigation > div');
		var menuNavUl = menuNav.find('.nav-menu');

		menuNav.mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'dark'
		});

		// Give primary content height of sidebar if sidebar is higher so border will strech all the way down

		var sidebar = $('#sidebar');
		var primaryContent = $('#primary');
		var primaryContentHeight = primaryContent.height();
		var sidebarHeight = sidebar.height();

		if(sidebarHeight >= primaryContentHeight && x >= 1280){
			primaryContent.height(sidebarHeight + 10);
		}

		// Masonry call

		var $container = $('div.grid-wrapper');

		$container.imagesLoaded( function() {
			$container.masonry({
				columnWidth: 1,
				itemSelector: '.grid-wrapper article',
				transitionDuration: 0
			}).masonry('reloadItems').masonry('layout');

			var masonryChild = $container.find('article.post');

			masonryChild.each(function(i){
				setTimeout(function(){
					masonryChild.eq(i).addClass('post-loaded animate');
				}, 200 * (i+1));
			});
		});

		// Sidebar masonry

		if(x > 767 && x < 1280){

			var $sidebarContainer = $('#sidebar');

			$sidebarContainer.imagesLoaded( function() {
				var $sidebarContainer = sidebar.masonry({
					itemSelector : '#sidebar .widget, .advertisement-widget:not(.half), .advert-wrap'
				}).masonry('layout');
			});
		}

		// If main content height is smaller than viewport height, give it a fixed height so it stretches to bottom

		var body = $('body');
		var siteContent = $('#content');
		var htmlOffsetTop = parseInt($('html').css('margin-top'));
		var headerHeight = $('#masthead').outerHeight();
		var footerHeight = $('#colophon').outerHeight();


		if(body.hasClass('single') || body.hasClass('page') || body.hasClass('search-no-results') || body.hasClass('error404')){
			if(x > 1024 && (siteContent.height() < (y - htmlOffsetTop))){
				siteContent.height(y - htmlOffsetTop);
			}
			else if((siteContent.height() < (y - headerHeight - footerHeight - htmlOffsetTop))){
				siteContent.height(y - headerHeight - footerHeight - htmlOffsetTop - 61);
			}
		}

	}); // End Window Load

	// Back-forward cache fix

	$(window).on('pageshow', function(event) {
		if (event.originalEvent.persisted) {
			window.location.reload();
		}
	});

	$(window).resize(function(){

		// Calculate clients viewport

		function viewport() {
			var e = window, a = 'inner';
			if(!('innerWidth' in window )) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
		}

		var w=window,d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth, // Viewport Width
		y=w.innerHeight||e.clientHeight||g.clientHeight; // Viewport Height

		// Main Menu

		// calculate max-height so main-navigatio dosn't overflow the footer

		if(x > 1024){
			var mainMenu = $('#site-navigation > div');
			var mainMenuOffsetTop = mainMenu.offset().top;
			var footerHeight = $('#colophon').outerHeight();
			var scrollFromTop = $(window).scrollTop();
			mainMenu.css('height', y - mainMenuOffsetTop + scrollFromTop - footerHeight - 50);
		}

		// Calculate top offset of big search buttons relative to header height

		var body = $('body');
		var bigSearchTrigger = $('a.search-big__trigger');
		var headerHeight = $('#masthead').outerHeight();

		if(x > 782 && x < 1025){
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', (headerHeight / 2 + 21)).show();
			}
			else{
				bigSearchTrigger.css('top', (headerHeight / 2 - 11)).show();
			}
		}
		else if(x > 767 && x <= 782){
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', (headerHeight / 2 + 35)).show();
			}
			else{
				bigSearchTrigger.css('top', (headerHeight / 2 - 11)).show();
			}
		}
		else if(x <= 767){
			bigSearchTrigger.css('top', (headerHeight / 2));
		}
		else{
			if(body.hasClass('admin-bar')){
				bigSearchTrigger.css('top', 84).show();
			}
			else{
				bigSearchTrigger.css('top', 49).show();
			}
		}

		// Give primary content height of sidebar if sidebar is higher so border will strech all the way down

		var sidebar = $('#sidebar');
		var primaryContent = $('#primary');
		var primaryContentHeight = primaryContent.height();
		var sidebarHeight = sidebar.height();

		if(sidebarHeight >= primaryContentHeight && x >= 1280){
			primaryContent.height(sidebarHeight + 10);
		}
		else{
			primaryContent.css('height', 'auto');
		}

		// If main content height is smaller than viewport height, give it a fixed height so it stretches to bottom

		var siteContent = $('#content');
		var htmlOffsetTop = parseInt($('html').css('margin-top'));
		var headerHeight = $('#masthead').outerHeight();
		var footerHeight = $('#colophon').outerHeight();


		if(body.hasClass('single') || body.hasClass('page') || body.hasClass('search-no-results')){
			if(x > 1024 && (siteContent.height() < (y - htmlOffsetTop))){
				siteContent.height(y - htmlOffsetTop);
			}
			else if((siteContent.height() < (y - headerHeight - footerHeight - htmlOffsetTop))){
				siteContent.height(y - headerHeight - footerHeight - htmlOffsetTop - 60);
			}
		}

	}); // End Window Resize

	// window unload

	$(window).on('beforeunload', function () {

		var body = $('body');

		body.removeClass('show');

		setTimeout(function() {
			return true;
		}, 200)

	});

})(jQuery);
