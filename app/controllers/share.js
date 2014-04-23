/**
 * Controller for the share screen
 *
 * @class Controllers.share
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];
var SELECTED;

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "share.init | " + JSON.stringify(CONFIG));

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	$.loadData();

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack(function(_event) {
			APP.removeChild({
				animation: APP.AnimationStyle.SlideLeft
			});
		});
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu(function(_event) {
			APP.toggleMenu();
		});
	} else {
		$.NavigationBar.showSettings(function(_event) {
			APP.openSettings();
		});
	}
};

/**
 * Loads the e-mail templates
 */
$.loadData = function() {
	APP.log("debug", "share.loadData");

	var templates = CONFIG.templates;
	var rows = [];

	for(var i = 0, x = templates.length; i < x; i++) {
		var row = Alloy.createController("share_row", {
			id: i,
			heading: templates[i].title
		}).getView();

		rows.push(row);
	}

	$.templates.setData(rows);

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = 0;

		// APP.addChild("share_preview", {
		// 	title: CONFIG.templates[SELECTED].title,
		// 	text: CONFIG.templates[SELECTED].text
		// });
		APP.addChild({
			controller: "share_preview",
			params: {
				title: CONFIG.templates[SELECTED].title,
				text: CONFIG.templates[SELECTED].text
			}
		});
	}
};

// Event listeners
$.templates.addEventListener("click", function(_event) {
	APP.log("debug", "share @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	// APP.addChild("share_preview", {
	//     title: CONFIG.templates[_event.row.id].title,
	//     text: CONFIG.templates[_event.row.id].text
	// });
	APP.addChild({
		controller: "share_preview",
		params: {
			title: CONFIG.templates[_event.row.id].title,
			text: CONFIG.templates[_event.row.id].text
		}
	});
});

// Kick off the init
$.init();