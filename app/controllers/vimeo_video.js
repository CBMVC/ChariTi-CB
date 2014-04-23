/**
 * Controller for the Vimeo video screen
 *
 * @class Controllers.vimeo.video
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

APP.log("debug", "vimeo_video | " + JSON.stringify(CONFIG));

$.container.url = CONFIG.url || "";
$.container.scalesPageToFit = true;
$.container.willHandleTouches = false;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

if(APP.Device.isHandheld) {
	$.NavigationBar.showBack(function(_event) {
		APP.removeChild({
			animation: APP.AnimationStyle.SlideLeft
		});;
	});
}