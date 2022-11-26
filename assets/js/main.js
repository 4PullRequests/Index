/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a'),
		$enableFetch = true,
		loadPanel = function($panel) {
			if(!$enableFetch) return;
			var $id = $panel.attr('id');
			$.ajax({
				url: `https://ghproxy.com/https://raw.githubusercontent.com/4PullRequests/Index/main/links/${$id}.json`,
				type: 'GET',
				success: function(data) {
					var json = JSON.parse(data);
					$panel.append(`<header><h2>${json.title}</h2></header>`);
					var row = $('<div class="row link-container"></div>');
					for (i in json.links) {
						var link = json.links[i];
						row.append(`
						<div class="col-12">
							<a href="${link.url}" target="_blank">
								<img src="${link.icon}"></img>
								<div class="link-info">
									<span class="title">${link.name}</span>
									<span class="desc">${link.description}</span>
								</div>
							</a>
						</div>`
						);
					}
					$panel.append(row);
				},
				error: function(data) {
					$panel.append(`<header><h2>${data.responseText} (${data.status})</h2></header>`);
				},
				complete: function() {
					console.log("first loaded.");
					switchPageAnimate($panel);
				}
			});
		},
		switchPageAnimate = function($panel) {
			setTimeout(function() {
				// Hide all panels.
					$panels.hide();
				// Set new max/min height.
					$main.animate({
						'max-height': $panel.outerHeight() + 'px',
						'min-height': $panel.outerHeight() + 'px'
					}, 250, function() {
						// Show target panel.
						$panel.show(250);
					});
				// Reset scroll.
					$window.scrollTop(0);
				// Delay.
					window.setTimeout(function() {
						// Activate target panel.
							$panel.removeClass('inactive');
						// Clear max/min height.
							$main
								.css('max-height', '')
								.css('min-height', '');
						// IE: Refresh.
							$window.triggerHandler('--refresh');
						// Unlock.
							locked = false;
					}, (breakpoints.active('small') ? 0 : 500));
			}, 250);
		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}
				// MrXiaoM: Load content from json.
					if (!$panel.hasClass('loaded') && !$panel.hasClass('intro')) {
						$panel.addClass('loaded');
						loadPanel($panel);
					}
				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}
					var isFirstLoad = !$panel.hasClass('loaded');
					var isHomePanel = $panel.hasClass('intro');
				// MrXiaoM: Load content from json.
					if (isFirstLoad && !isHomePanel) {
						$panel.addClass('loaded');
						loadPanel($panel);
					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

					if (!isFirstLoad || isHomePanel) {
						console.log("loaded");
						switchPageAnimate($panel);
					}
			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);