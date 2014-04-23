/**
 * Controller for the event list screen
 *
 * @class Controllers.event
 * @uses Models.event
 * @uses core
 * @uses utilities
 */
var APP = require("core");
var UTIL = require("utilities");
var DATE = require("alloy/moment");
var MODEL = require("models/event")();

var CONFIG = arguments[0];
var SELECTED;

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "event.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	CONFIG.feed = "https://graph.facebook.com/" + CONFIG.userid + "/events?fields=id,name,start_time,end_time,location,description&since=now&access_token=AAAEdFU8bj50BAL7MQcSHuIDf1KzST7gZAAubz49tio8yLM8Lb7o29IxtxZALrogeimSAsTkYXJRzzqrRqSniABwtDRPONoQxsdNy6XQjIaRR9sedAM";

	APP.openLoading();

	$.retrieveData();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

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
 * Retrieves the data
 * @param {Object} _force Whether to force the request or not (ignores cached data)
 * @param {Object} _callback The function to run on data retrieval
 */
$.retrieveData = function(_force, _callback) {
	MODEL.fetch({
		url: CONFIG.feed,
		cache: _force ? 0 : CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllEvents());

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
	APP.log("debug", "event.handleData");

	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("event_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: DATE(parseInt(_data[i].date_start, 10)).format("MMMM Do, YYYY h:mma")
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = _data[0].id;

		APP.addChild({
			controller: "event_event",
			params: {
				id: _data[0].id,
				index: CONFIG.index
			}
		});
	}
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "event @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	// APP.addChild("event_event", {
	//     id: _event.row.id,
	//     index: CONFIG.index
	// });
	APP.addChild({
		controller: "event_event",
		params: {
			id: _event.row.id,
			index: CONFIG.index
		},
		animation: APP.AnimationStyle.SlideRight
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