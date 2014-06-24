/**
 * Controller for the Facebook post list screen
 *
 * @class Controllers.facebook
 * @uses Models.facebook
 * @uses core
 * @uses utilities
 */
var APP = require("core");
var UTIL = require("utilities");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/facebook")();

var CONFIG = arguments[0];
var SELECTED;

var offset = 0;
var refreshLoading = false;
var refreshEngaged = false;

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "facebook.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	CONFIG.feed = "http://www.facebook.com/feeds/page.php?format=json&id=" + CONFIG.userid;

	APP.openLoading();

	$.retrieveData();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack(function(_event) {
			APP.removeChild({
				animation: APP.AnimationStyle.NavRight
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
 * Retrieves the data
 * @param {Object} _force Whether to force the request or not (ignores cached data)
 * @param {Object} _callback The function to run on data retrieval
 */
$.retrieveData = function(_force, _callback) {
	MODEL.fetch({
		url: CONFIG.feed,
		cache: _force ? 0 : CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllArticles());

			if(typeof _callback !== "undefined") {
				_callback();
			}
		},
		error: function() {
			APP.closeLoading();

			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Unable to connect; try again later",
				duration: 2000,
				view: APP.GlobalWrapper
			});

			if(typeof _callback !== "undefined") {
				_callback();
			}
		}
	});
};

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "facebook.handleData");

	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var time = DATE(parseInt(_data[i].date, 10));
		time = time.isBefore() ? time : DATE();

		var row = Alloy.createController("facebook_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: STRING.ucfirst(time.fromNow())
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = _data[0].id;

		// APP.addChild("facebook_article", {
		// 	id: _data[0].id,
		// 	index: CONFIG.index
		// });

		APP.addChild({
			controller: "facebook_article",
			params: {
				id: _data[0].id,
				index: CONFIG.index
			}
		});
	}
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "facebook @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	// APP.addChild("facebook_article", {
	// 	id: _event.row.id,
	// 	index: CONFIG.index
	// });

	APP.addChild({
		controller: "facebook_article",
		params: {
			id: _event.row.id,
			index: CONFIG.index
		},
		animation: APP.AnimationStyle.NavLeft
	});
});

/**
 * Handles the pull-to-refresh event
 * @param {Object} _event The event
 */
function ptrRelease(_event) {
	$.retrieveData(true, function() {
		_event.hide();
	});
}

// Kick off the init
$.init();