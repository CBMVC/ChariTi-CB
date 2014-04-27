/**
 * The main app singleton used throughout the app. This object contains static
 * properties, global event handling, etc.
 *
 * @class core
 * @singleton
 * @uses utilities
 * @uses http
 * @uses migrate
 * @uses update
 * @uses push
 * @uses Modules.ti.cloud
 */
var Alloy = require("alloy");
var UTIL = require("utilities");
var HTTP = require("http");
var Animator = require("animator");

var APP = {
	/**
	 * Application ID
	 * @type {String}
	 */
	ID: null,
	/**
	 * Application version
	 * @type {String}
	 */
	VERSION: null,
	/**
	 * ChariTi-CB  version
	 * @type {String}
	 */
	CBCVERSION: "1.0.1",
	/**
	 * ChariTi framework version
	 * @type {String}
	 */
	CVERSION: "1.2.2",
	/**
	 * Legal information
	 * @type {Object}
	 * @param {String} COPYRIGHT Copyright information
	 * @param {String} TOS Terms of Service URL
	 * @param {String} PRIVACY Privacy Policy URL
	 */
	LEGAL: {
		COPYRIGHT: null,
		TOS: null,
		PRIVACY: null
	},
	/**
	 * URL to remote JSON configuration file
	 *
	 * **NOTE: This can be used for over-the-air (OTA) application updates.**
	 * @type {String}
	 */
	ConfigurationURL: null,
	/**
	 * URL to remote API
	 *
	 * @type {String}
	 */
	RemoteAPIURL: null,
	/**
	 * Whether use the deuault setting button in the framework
	 *
	 * @type {Boolean}
	 */
	UseDefaultSettingButton: null,
	/**
	 * The app store download link for the app
	 *
	 * @type {String}
	 */
	AppStoreLink: null,
	/**
	 * The google play download link for the app
	 *
	 * @type {String}
	 */
	GooglePlayLink: null,
	/**
	 * Whether support tablet in the app
	 *
	 * @type {Boolean}
	 */
	TabletSupport: null,
	/**
	 * Default startup screen
	 *
	 * @type {String}
	 */
	StartupScreen: 0,
	/**
	 * The default language of the app
	 *
	 * **NOTE: The language code should be map to the langs folder's file name.**
	 * @type {String}
	 */
	DefaultLanguage: null,
	/**
	 * Get the current language
	 * @type {[type]}
	 */
	CurrentLanguage: null,
	/**
	 * Get the images folder with current language
	 * @type {[type]}
	 */
	ImagesFolder: null,
	/**
	 * Whether support multiple languages
	 * @type {Boolean}
	 */
	IsMultiLanguage: true,
	/**
	 * The language object for get the language content
	 * @type {Object}
	 */
	langObj: null,
	/**
	 * The database name of the app
	 *
	 * @type {String}
	 */
	Database: 'ChariTi',
	/**
	 * All the component nodes (e.g. tabs)
	 * @type {Object}
	 */
	Nodes: [],
	/**
	 * Application settings as defined in JSON configuration file
	 * @type {Object}
	 * @param {String} share The share text
	 * @param {Object} notifications Push notifications options
	 * @param {Boolean} notifications.enabled Whether or not push notifications are enabled
	 * @param {String} notifications.provider Push notifications provider
	 * @param {String} notifications.key Push notifications key
	 * @param {String} notifications.secret Push notifications secret
	 * @param {Object} colors Color options
	 * @param {String} colors.primary The primary color
	 * @param {String} colors.secondary The secondary color
	 * @param {String} colors.theme The theme of the primary color, either "light" or "dark"
	 * @param {Object} colors.hsb The HSB values of the primary color
	 * @param {Boolean} useSlideMenu Whether or not to use the slide menu (alternative is tabs)
	 */
	Settings: null,
	/**
	 *  Set true will save the log in database
	 */
	LogToDB: false,
	/**
	 * Device information
	 * @type {Object}
	 * @param {Boolean} isHandheld Whether the device is a handheld
	 * @param {Boolean} isTablet Whether the device is a tablet
	 * @param {String} type The type of device, either "handheld" or "tablet"
	 * @param {String} os The name of the OS, either "IOS" or "ANDROID"
	 * @param {String} name The name of the device, either "IPHONE", "IPAD" or the device model if Android
	 * @param {String} version The version of the OS
	 * @param {Number} versionMajor The major version of the OS
	 * @param {Number} versionMinor The minor version of the OS
	 * @param {Number} width The width of the device screen
	 * @param {Number} height The height of the device screen
	 * @param {Number} dpi The DPI of the device screen
	 * @param {String} orientation The device orientation, either "LANDSCAPE" or "PORTRAIT"
	 * @param {String} statusBarOrientation A Ti.UI orientation value
	 */
	Device: {
		isHandheld: Alloy.isHandheld,
		isTablet: Alloy.isTablet,
		type: Alloy.isHandheld ? "handheld" : "tablet",
		os: null,
		name: null,
		version: Ti.Platform.version,
		versionMajor: parseInt(Ti.Platform.version.split(".")[0], 10),
		versionMinor: parseInt(Ti.Platform.version.split(".")[1], 10),
		width: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi: Ti.Platform.displayCaps.dpi,
		orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "LANDSCAPE" : "PORTRAIT",
		statusBarOrientation: null
	},
	/**
	 * Network status and information
	 * @type {Object}
	 * @param {String} type Network type name
	 * @param {Boolean} online Whether the device is connected to a network
	 */
	Network: {
		type: Ti.Network.networkTypeName,
		online: Ti.Network.online
	},
	/**
	 * Current controller view stack index
	 * @type {Number}
	 */
	currentStack: -1,
	/**
	 * The previous screen in the hierarchy
	 * @type {Object}
	 */
	previousScreen: null,
	/**
	 * The view stack for controllers
	 * @type {Array}
	 */
	controllerStacks: [],
	/**
	 * The view stack for modals
	 * @type {Array}
	 */
	modalStack: [],
	/**
	 * Whether or not the current view has a tablet layout
	 * @type {Boolean}
	 */
	hasDetail: false,
	/**
	 * Current detail view stack index
	 * @type {Number}
	 */
	currentDetailStack: -1,
	/**
	 * The previous detail screen in the hierarchy
	 * @type {Object}
	 */
	previousDetailScreen: null,
	/**
	 * The view stack for detail views
	 * @type {Array}
	 */
	detailStacks: [],
	/**
	 * The view stack for master views
	 * @type {Array}
	 */
	Master: [],
	/**
	 * The view stack for detail views
	 * @type {Array}
	 */
	Detail: [],
	/**
	 * The main app window
	 * @type {Object}
	 */
	MainWindow: null,
	/**
	 * The global view all screen controllers get added to
	 * @type {Object}
	 */
	GlobalWrapper: null,
	/**
	 * The global view all content screen controllers get added to
	 * @type {Object}
	 */
	ContentWrapper: null,
	/**
	 * Holder for ACS cloud module
	 * @type {Object}
	 */
	ACS: null,
	/**
	 * The loading view
	 * @type {Object}
	 */
	Loading: null,
	/**
	 * Whether or not to cancel the loading screen open because it's already open
	 * @type {Boolean}
	 */
	cancelLoading: false,
	/**
	 * Whether or not the loading screen is open
	 * @type {Boolean}
	 */
	loadingOpen: false,
	/**
	 * Tabs widget
	 * @type {Object}
	 */
	Tabs: null,
	/**
	 * Slide Menu widget
	 * @type {Object}
	 */
	SlideMenu: null,
	/**
	 * Whether or not the slide menu is open
	 * @type {Boolean}
	 */
	SlideMenuOpen: false,
	/**
	 * Whether or not the slide menu is engaged
	 *
	 * **NOTE: Turning this false temporarily disables the slide menu**
	 * @type {Boolean}
	 */
	SlideMenuEngaged: true,
	/**
	 * Initializes the application
	 */
	init: function() {
		Ti.API.debug("APP.init");

		// Global system Events
		Ti.Network.addEventListener("change", APP.networkObserver);
		Ti.Gesture.addEventListener("orientationchange", APP.orientationObserver);
		Ti.App.addEventListener("pause", APP.exitObserver);
		Ti.App.addEventListener("close", APP.exitObserver);
		Ti.App.addEventListener("resumed", APP.resumeObserver);

		if(OS_ANDROID) {
			APP.MainWindow.addEventListener("androidback", APP.backButtonObserver);
		}

		// Determine device characteristics
		APP.determineDevice();

		// Migrate to newer version
		require("migrate").init();

		// Create a database
		APP.setupDatabase();

		// Reads in the JSON config file
		APP.loadContent();

		// Builds out the tab group
		APP.build();

		// Open the main window
		APP.MainWindow.open();

		// The initial screen to show
		APP.handleNavigation(APP.StartupScreen);

		// NOTICE:
		// The following sections are abstracted for PEEK

		// Updates the app from a remote source
		APP.update();

		// Set up ACS
		APP.initACS();

		// Set up push notifications
		APP.initPush();
	},
	/**
	 * Determines the device characteristics
	 */
	determineDevice: function() {
		if(OS_IOS) {
			APP.Device.os = "IOS";

			if(Ti.Platform.osname.toUpperCase() == "IPHONE") {
				APP.Device.name = "IPHONE";
			} else if(Ti.Platform.osname.toUpperCase() == "IPAD") {
				APP.Device.name = "IPAD";
			}
		} else if(OS_ANDROID) {
			APP.Device.os = "ANDROID";

			APP.Device.name = Ti.Platform.model.toUpperCase();

			// Fix the display values
			APP.Device.width = (APP.Device.width / (APP.Device.dpi / 160));
			APP.Device.height = (APP.Device.height / (APP.Device.dpi / 160));
		}
	},
	/**
	 * Setup the database bindings
	 */
	setupDatabase: function() {
		Ti.API.debug("APP.setupDatabase");

		var db = Ti.Database.open(APP.Database);

		db.execute("CREATE TABLE IF NOT EXISTS updates (url TEXT PRIMARY KEY, time TEXT);");
		db.execute("CREATE TABLE IF NOT EXISTS log (time INTEGER, type TEXT, message TEXT);");

		// Fill the log table with empty rows that we can 'update', providing a max row limit
		var data = db.execute("SELECT time FROM log;");

		if(data.rowCount === 0) {
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0; i < 100; i++) {
				db.execute("INSERT INTO log VALUES (" + i + ", \"\", \"\");");
			}

			db.execute("END TRANSACTION;");
		}

		data.close();
		db.close();
	},
	/**
	 * Drops the entire database
	 */
	dropDatabase: function() {
		Ti.API.debug("APP.dropDatabase");

		var db = Ti.Database.open(APP.Database);
		db.remove();
	},
	/**
	 * Loads in the appropriate controller and config data
	 */
	loadContent: function(isRebuild) {
		APP.log("debug", "APP.loadContent");

		var contentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");

		if(!contentFile.exists()) {
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
		}

		var content = contentFile.read();
		var data;

		try {
			data = JSON.parse(content.text);
		} catch(_error) {
			APP.log("error", "Unable to parse downloaded JSON, reverting to packaged JSON");

			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");

			if(contentFile.exists()) {
				content = contentFile.read();
				data = JSON.parse(content.text);
			} else {
				APP.log("error", "Unable to parse local JSON, dying");

				alert("Unable to open the application");

				return;
			}
		}

		APP.ID = data.id;
		APP.VERSION = data.version;
		APP.LEGAL = {
			COPYRIGHT: data.legal.copyright,
			TOS: data.legal.terms,
			PRIVACY: data.legal.privacy
		};

		APP.DefaultLanguage = data.defaultLanguage;

		APP.IsMultiLanguage = data.isMultiLanguage;

		APP.LogToDB = data.logToDB;

		//set the current database
		UTIL.setDatabase(APP.Database);

		APP.ConfigurationURL = data.configurationUrl && data.configurationUrl.length > 10 ? data.configurationUrl : false;
		APP.RemoteAPIURL = data.remoteAPIUrl;
		APP.UseDefaultSettingButton = data.useDefaultSettingButton;
		APP.TabletSupport = data.tabletSupport;
		APP.StartupScreen = data.startupScreen;
		APP.AppStoreLink = data.appStoreLink;
		APP.GooglePlayLink = data.googlePlayLink;

		APP.Settings = data.settings;
		APP.Nodes = data.tabs;

		for(var i = 0, x = APP.Nodes.length; i < x; i++) {
			APP.Nodes[i].index = i;
		}

		if(typeof APP.Settings.useSlideMenu == "undefined") {
			APP.Settings.useSlideMenu = false;
		}

		APP.Settings.colors.hsb = {
			primary: UTIL.hexToHsb(APP.Settings.colors.primary),
			secondary: UTIL.hexToHsb(APP.Settings.colors.secondary)
		};

		APP.Settings.colors.theme = APP.Settings.colors.hsb.primary.b < 65 ? "dark" : "light";

		if(OS_IOS) {
			APP.MainWindow.statusBarStyle = APP.Settings.colors.theme == "dark" ? Ti.UI.iPhone.StatusBar.LIGHT_CONTENT : Ti.UI.iPhone.StatusBar.DEFAULT;
		}

		//init default language
		if(APP.IsMultiLanguage) {
			var lang = Ti.App.Properties.getString('lang');
			if(lang === null) {
				lang = APP.DefaultLanguage;
				Ti.App.Properties.setString('lang', lang);
			}
			APP.langObj = require('langs/' + lang);
			//APP.log('info', APP.langObj, 'core in 463', true);
			APP.CurrentLanguage = lang;
			APP.ImagesFolder = '/images/' + APP.CurrentLanguage + '/';
		} else {
			APP.ImagesFolder = '/images/';
		}

		APP.log('info', 'Ti.Filesystem.applicationDataDirectory:' + Ti.Filesystem.applicationDataDirectory);
		//APP.log('info', 'Ti.Filesystem.resourcesDirectory:' + Ti.Filesystem.resourcesDirectory);

		APP.Loading = Alloy.createWidget("com.mcongrove.loading").getView();
	},
	/**
	 * Builds out the tab group
	 */
	build: function() {
		APP.log("debug", "APP.build");
		var currLang = Ti.App.Properties.getString('lang');
		var nodes = [];
		var imageFolder = !APP.Settings.useSlideMenu && APP.Settings.colors.theme == "light" ? "/icons/black/" : "/icons/white/";
		var langImageFolder = imageFolder + currLang + "/";
		var hasMenuHeaders = false;
		// if(APP.IsMultiLanguage) {
		//  imageFolder = langImageFolder;
		// }

		for(var i = 0, x = APP.Nodes.length; i < x; i++) {
			var tabImage = imageFolder + APP.Nodes[i].image + ".png";
			if(APP.Nodes[i].isMultiLanguage) {
				tabImage = langImageFolder + APP.Nodes[i].image + ".png";
			}
			nodes.push({
				id: i,
				title: APP.IsMultiLanguage ? APP.L(APP.Nodes[i].title) : APP.Nodes[i].title,
				image: UTIL.fileExists(tabImage) ? tabImage : null,
				controller: APP.Nodes[i].type.toLowerCase(),
				menuHeader: APP.Nodes[i].menuHeader
			});

			if(APP.Settings.useSlideMenu && APP.Nodes[i].menuHeader) {
				hasMenuHeaders = true;
			}
		}

		if(APP.Settings.useSlideMenu) {
			if(APP.UseDefaultSettingButton) {
				// Add the Settings tab
				nodes.push({
					id: "settings",
					title: "Settings",
					image: "/icons/white/settings.png",
					menuHeader: hasMenuHeaders ? "Application" : null
				});
			}

			APP.buildMenu(nodes);
		} else {
			APP.buildTabs(nodes);
		}
	},
	/**
	 * Builds a TabGroup
	 * @param {Array} _nodes The items (tabs) to build
	 */
	buildTabs: function(_nodes) {
		APP.log("debug", "APP.buildTabs");

		APP.Tabs.init({
			nodes: _nodes,
			more: APP.Settings.colors.theme == "dark" ? "/icons/white/more.png" : "/icons/black/more.png",
			color: {
				background: APP.Settings.colors.primary,
				active: APP.Settings.colors.secondary,
				text: APP.Settings.colors.theme == "dark" ? "#FFF" : "#000"
			}
		});

		// Add a handler for the tabs (make sure we remove existing ones first)
		APP.Tabs.Wrapper.removeEventListener("click", APP.handleTabClick);
		APP.Tabs.Wrapper.addEventListener("click", APP.handleTabClick);
	},
	/**
	 * Builds a slide menu
	 * @param {Array} _nodes The items (menu nodes) to build
	 */
	buildMenu: function(_nodes) {
		APP.log("debug", "APP.buildMenu");

		APP.SlideMenu.init({
			nodes: _nodes,
			color: {
				headingBackground: APP.Settings.colors.primary,
				headingText: APP.Settings.colors.theme == "dark" ? "#FFF" : "#000"
			}
		});

		// Remove the TabGroup
		APP.GlobalWrapper.remove(APP.Tabs.Wrapper);

		// Move everything down to take up the TabGroup space
		APP.ContentWrapper.bottom = "0dp";

		// Add a handler for the nodes (make sure we remove existing ones first)
		APP.SlideMenu.Nodes.removeEventListener("click", APP.handleMenuClick);
		APP.SlideMenu.Nodes.addEventListener("click", APP.handleMenuClick);

		// Listen for gestures on the main window to open/close the slide menu
		APP.GlobalWrapper.addEventListener("swipe", function(_event) {
			if(APP.SlideMenuEngaged) {
				if(_event.direction == "right") {
					APP.openMenu();
				} else if(_event.direction == "left") {
					APP.closeMenu();
				}
			}
		});
	},
	/**
	 * Re-builds the app with newly downloaded JSON configration file
	 */
	rebuild: function(pageIndex) {
		APP.log("debug", "APP.rebuild");
		if(pageIndex == undefined) {
			pageIndex = APP.StartupScreen;
		}
		APP.SlideMenu.clear();
		APP.Tabs.clear();

		// Undo removal of TabGroup
		APP.GlobalWrapper.remove(APP.Tabs.Wrapper);
		APP.GlobalWrapper.add(APP.Tabs.Wrapper);
		APP.ContentWrapper.bottom = "40dp";

		APP.currentStack = -1;
		APP.previousScreen = null;
		APP.controllerStacks = [];
		APP.modalStack = [];
		APP.hasDetail = false;
		APP.currentDetailStack = -1;
		APP.previousDetailScreen = null;
		APP.detailStacks = [];
		APP.Master = [];
		APP.Detail = [];
		APP.cancelLoading = false;
		APP.loadingOpen = false;

		APP.dropDatabase();

		// NOTICE
		// The following section is abstracted for PEEK

		APP.rebuildRestart(pageIndex);
	},
	/**
	 * Kicks off the newly re-built application
	 */
	rebuildRestart: function(pageIndex) {
		Ti.API.debug("APP.rebuildRestart");

		APP.setupDatabase();
		APP.loadContent(true);
		APP.build();
		APP.handleNavigation(pageIndex);
	},
	/**
	 * Updates the app from a remote source
	 */
	update: function() {
		require("update").init();
	},
	/**
	 * Set up ACS
	 */
	initACS: function() {
		APP.log("debug", "APP.initACS");

		APP.ACS = require("ti.cloud");
	},
	/**
	 * Set up push notifications
	 */
	initPush: function() {
		APP.log("debug", "APP.initPush");

		if(APP.Settings.notifications.enabled) {
			require("push").init();
		}
	},
	/**
	 * Handles the click event on a tab
	 * @param {Object} _event The event
	 */
	handleTabClick: function(_event) {
		//APP.log("debug", _event, "core 636", true);
		if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
			if(APP.Nodes[_event.source.id].customEvent) {
				//just fire the custom event
				Ti.App.fireEvent(APP.Nodes[_event.source.id].customEvent);
				return;
			} else {
				APP.handleNavigation(_event.source.id);
			}
		}
	},
	/**
	 * Handles the click event on a menu item
	 * @param {Object} _event The event
	 */
	handleMenuClick: function(_event) {
		if(APP.UseDefaultSettingButton) {
			if(typeof _event.row.id !== "undefined" && typeof _event.row.id == "number") {
				APP.closeSettings();

				APP.handleNavigation(_event.row.id);
			} else if(typeof _event.row.id !== "undefined" && _event.row.id == "settings") {
				APP.openSettings();
			}
		}

		APP.toggleMenu();
	},
	/**
	 * Global event handler to change screens
	 * @param {String} _id The ID (index) of the tab being opened
	 */
	handleNavigation: function(_id) {
		APP.log("debug", "APP.handleNavigation | " + APP.Nodes[_id].type);

		// Requesting same screen as we're on
		if(_id == APP.currentStack) {
			// Do nothing
			return;
		} else {

			if(APP.Settings.useSlideMenu) {
				// Select the row for the requested item
				APP.SlideMenu.setIndex(_id);
			} else {
				// Move the tab selection indicator
				APP.Tabs.setIndex(_id);
			}

			// Closes any loading screens
			APP.closeLoading();

			// Set current stack
			APP.currentStack = _id;

			// Create new controller stack if it doesn't exist
			if(typeof APP.controllerStacks[_id] === "undefined") {
				APP.controllerStacks[_id] = [];
			}

			if(APP.Device.isTablet && APP.TabletSupport) {
				APP.currentDetailStack = _id;

				if(typeof APP.detailStacks[_id] === "undefined") {
					APP.detailStacks[_id] = [];
				}
			}

			if(APP.Nodes[_id].extUrl) {
				Ti.Platform.openURL(APP.Nodes[_id].extUrl);
			} else {
				// Set current controller stack
				var controllerStack = APP.controllerStacks[_id];

				// If we're opening for the first time, create new screen
				// Otherwise, add the last screen in the stack (screen we navigated away from earlier on)
				var screen;

				APP.hasDetail = false;
				APP.previousDetailScreen = null;

				if(controllerStack.length > 0) {
					// Retrieve the last screen
					if(APP.Device.isTablet && APP.TabletSupport) {
						screen = controllerStack[0];

						if(screen.type == "tablet") {
							APP.hasDetail = true;
						}
					} else {
						screen = controllerStack[controllerStack.length - 1];
						//APP.log('debug', screen.children, 'core 762', true);
					}

					// Tell the parent screen it was added to the window
					/*
                    if(controllerStack[0].type == "tablet") {
                        controllerStack[0].fireEvent("APP:tabletScreenAdded");
                    } else {
                        controllerStack[0].fireEvent("APP:screenAdded");
                    }
                    */
				} else {
					// Create a new screen
					var type = APP.Nodes[_id].type.toLowerCase();
					var tabletSupport = APP.Nodes[_id].tabletSupport;

					// TODO: Remove this. Find other way to determine if tablet version is available
					if(APP.Device.isTablet && APP.TabletSupport) {
						if(tabletSupport) {
							type = "tablet";
							APP.hasDetail = true;
						} else {
							// type = "tablet";
							// APP.hasDetail = true;
							// break;
						}
					}

					screen = Alloy.createController(type, APP.Nodes[_id]).getView();

					// Add screen to the controller stack
					controllerStack.push(screen);

					// Tell the screen it was added to the window
					/*
                    if(screen.type == "tablet") {
                        screen.fireEvent("APP:tabletScreenAdded");
                    } else {
                        screen.fireEvent("APP:screenAdded");
                    }
                    */
				}

				//APP.log('info', screen.isChild, 'sereen is child line 835 core.js');
				// Add the screen to the window
				APP.addScreen(screen);

				// Reset the modal stack
				APP.modalStack = [];
			}
		}
	},
	/**
	 * Open a child screen
	 * @param {String} controller The name of the controller to open
	 * @param {Object} params An optional dictionary of parameters to pass to the controller
	 * @param {Boolean} modal Whether this is for the modal stack
	 * @param {Boolean} sibling Whether this is a sibling view
	 * @param {Boolean} animation The animation of the navigation
	 */
	addChild: function(_params) {
		var stack;

		// Determine if stack is associated with a tab
		if(_params.modal) {
			stack = APP.modalStack;
		} else {
			if(APP.Device.isHandheld || !APP.hasDetail) {
				stack = APP.controllerStacks[APP.currentStack];
			} else {
				stack = APP.detailStacks[APP.currentDetailStack];
			}
		}

		// Create the new screen controller
		var screen = Alloy.createController(_params.controller, _params.params).getView();
		// Set the screen name
		screen.name = _params.controller;

		if(_params.sibling) {
			stack.pop();
		}

		// Add screen to the controller stack
		stack.push(screen);

		// Add the screen to the window
		if(APP.Device.isHandheld || !APP.hasDetail || _params.modal) {
			APP.addScreen(screen, _params.animation);
		} else {
			APP.addDetailScreen(screen, _params.animation);
		}

		APP.log("debug", stack.length, "stack length line 870:");
	},
	/**
	 * Removes a child screen
	 * @param {Boolean} modal Removes the child from the modal stack
	 * @param {Boolean} animation The animation of the navigation
	 */
	removeChild: function(_params) {
		var stack;

		if(_params.modal) {
			stack = APP.modalStack;
		} else {
			if(APP.Device.isTablet && APP.hasDetail) {
				stack = APP.detailStacks[APP.currentDetailStack];
			} else {
				stack = APP.controllerStacks[APP.currentStack];
			}
		}
		//default just remove one screen
		var removeIndex = stack.length - 1;
		if(_params.toIndex) {
			//remove to the define index screen
			removeIndex = _params.toIndex;
		}
		var previousStack;
		var previousScreen;
		var stackLength = stack.length;
		//popup the stacks
		for(var removeItem = removeIndex; removeItem < stackLength; removeItem++) {
			stack.pop();
		}

		if(stack.length === 0) {
			previousStack = APP.controllerStacks[APP.currentStack];

			if(APP.Device.isHandheld || !APP.hasDetail) {
				previousScreen = previousStack[previousStack.length - 1];

				APP.addScreen(previousScreen, _params.animation);
			} else {
				previousScreen = previousStack[0];

				if(_params._modal) {
					APP.addScreen(previousScreen, _params.animation);
				} else {
					APP.addDetailScreen(previousScreen, _params.animation);
				}
			}
		} else {

			previousScreen = stack[stack.length - 1];

			if(APP.Device.isHandheld || !APP.hasDetail) {
				APP.addScreen(previousScreen, _params.animation);
			} else {
				if(_params._modal) {
					APP.addScreen(previousScreen, _params.animation);
				} else {
					APP.addDetailScreen(previousScreen);
				}
			}
		}
	},
	/**
	 * Removes all children screens
	 * @param {Boolean} _modal Removes all children from the stack
	 */
	removeAllChildren: function(_params) {
		var stack = _params.modal ? APP.modalStack : APP.controllerStacks[APP.currentStack];

		for(var i = stack.length - 1; i > 0; i--) {
			stack.pop();
		}

		APP.addScreen(stack[0], _params.animation);
	},
	/**
	 * Global function to add a screen
	 * @param {Object} _screen The screen to add
	 */
	addScreen: function(_screen, animationStyle) {
		if(_screen) {
			//APP.log('info', animationStyle, 'current animationStyle', true);
			if(animationStyle && APP.Settings.useSlideMenu) {
				APP.SlideMenu.hide();
				APP.log('info', 'hide slide menu in core line 946');
			}
			switch(animationStyle) {
				case APP.AnimationStyle.Fade:
					_screen.opacity = 0;
					APP.ContentWrapper.add(_screen);
					Animator.fade({
						view: _screen,
						value: 1,
						onComplete: function() {
							if(animationStyle && APP.Settings.useSlideMenu) {
								APP.SlideMenu.show();
							}
							if(APP.previousScreen) {
								APP.removeScreen(APP.previousScreen);
							}
							APP.previousScreen = _screen;
						}
					});
					break;
				case APP.AnimationStyle.SlideRight:
					APP.log('debug', 'SlideRight APP.previousScreen');
					Animator.moveTo({
						view: APP.previousScreen,
						value: {
							x: -APP.Device.width,
							y: 0
						},
						onComplete: function() {
							if(animationStyle && APP.Settings.useSlideMenu) {
								APP.SlideMenu.show();
							}
							APP.ContentWrapper.add(_screen);
							//reset the view position
							Animator.moveTo({
								view: APP.previousScreen,
								duration: 0,
								value: {
									x: 0,
									y: 0
								}
							});
							APP.removeScreen(APP.previousScreen);
							APP.previousScreen = _screen;
						}
					});
					break;
				case APP.AnimationStyle.SlideLeft:
					APP.log('debug', 'SlideLeft APP.previousScreen');
					Animator.moveTo({
						view: APP.previousScreen,
						value: {
							x: APP.Device.width,
							y: 0
						},
						onComplete: function() {
							if(animationStyle && APP.Settings.useSlideMenu) {
								APP.SlideMenu.show();
							}
							APP.ContentWrapper.add(_screen);
							//reset the view position
							Animator.moveTo({
								view: APP.previousScreen,
								duration: 0,
								value: {
									x: 0,
									y: 0
								}
							});
							APP.removeScreen(APP.previousScreen);
							APP.previousScreen = _screen;
						}
					});
					break;
				case APP.AnimationStyle.SlideUp:
					APP.log('debug', 'SlideUp APP.previousScreen');
					Animator.moveTo({
						view: APP.previousScreen,
						duration: 450,
						value: {
							x: 0,
							y: -APP.Device.height
						},
						onComplete: function() {
							if(animationStyle && APP.Settings.useSlideMenu) {
								APP.SlideMenu.show();
							}
							APP.ContentWrapper.add(_screen);
							//reset the view position
							Animator.moveTo({
								view: APP.previousScreen,
								duration: 0,
								value: {
									x: 0,
									y: 0
								}
							});
							APP.removeScreen(APP.previousScreen);
							APP.previousScreen = _screen;
						}
					});
					break;
				case APP.AnimationStyle.SlideDown:
					APP.log('debug', 'SlideDown APP.previousScreen');
					Animator.moveTo({
						view: APP.previousScreen,
						duration: 450,
						value: {
							x: 0,
							y: APP.Device.height
						},
						onComplete: function() {
							if(animationStyle && APP.Settings.useSlideMenu) {
								APP.SlideMenu.show();
							}
							APP.ContentWrapper.add(_screen);
							//reset the view position
							Animator.moveTo({
								view: APP.previousScreen,
								duration: 0,
								value: {
									x: 0,
									y: 0
								}
							});
							APP.removeScreen(APP.previousScreen);
							APP.previousScreen = _screen;
						}
					});
					break;
				default:
					APP.ContentWrapper.add(_screen);

					if(APP.previousScreen) {
						APP.removeScreen(APP.previousScreen);
					}

					APP.previousScreen = _screen;
					break;
			}
		}
	},
	/**
	 * Global function to remove a screen
	 * @param {Object} _screen The screen to remove
	 */
	removeScreen: function(_screen) {
		if(_screen) {
			APP.ContentWrapper.remove(_screen);

			APP.previousScreen = null;
		}
	},
	/**
	 * Adds a screen to the Master window
	 * @param {String} _controller The name of the controller to open
	 * @param {Object} _params An optional dictionary of parameters to pass to the controller
	 * @param {Object} _wrapper The parent wrapper screen to fire events to
	 */
	addMasterScreen: function(_controller, _params, _wrapper) {
		var screen = Alloy.createController(_controller, _params).getView();

		/*
        _wrapper.addEventListener("APP:tabletScreenAdded", function(_event) {
            screen.fireEvent("APP:screenAdded");
        });
        */

		APP.Master[APP.currentStack].add(screen);
	},
	/**
	 * Adds a screen to the Detail window
	 * @param {Object} _screen The screen to add
	 */
	addDetailScreen: function(_screen) {
		if(_screen) {
			APP.Detail[APP.currentStack].add(_screen);

			if(APP.previousDetailScreen && APP.previousDetailScreen != _screen) {
				var pop = true;

				if(APP.detailStacks[APP.currentDetailStack][0].type == "PARENT" && _screen.type != "PARENT") {
					pop = false;
				}

				APP.removeDetailScreen(APP.previousDetailScreen, pop);
			}

			APP.previousDetailScreen = _screen;
		}
	},
	/**
	 * Removes a screen from the Detail window
	 * @param {Object} _screen The screen to remove
	 * @param {Boolean} _pop Whether to pop the item off the controller stack
	 */
	removeDetailScreen: function(_screen, _pop) {
		if(_screen) {
			APP.Detail[APP.currentStack].remove(_screen);

			APP.previousDetailScreen = null;

			if(_pop) {
				var stack = APP.detailStacks[APP.currentDetailStack];

				stack.splice(0, stack.length - 1);
			}
		}
	},
	/**
	 * Opens the Settings window
	 */
	openSettings: function() {
		if(APP.UseDefaultSettingButton) {
			APP.log("debug", "APP.openSettings");

			//APP.addChild("settings", {}, true);
			APP.addChild({
				controller: "settings",
				model: true
			});
		}
	},
	/**
	 * Closes all non-tab stacks
	 */
	closeSettings: function() {
		if(APP.modalStack.length > 0 && APP.UseDefaultSettingButton) {
			// APP.removeChild({
			//  modal: true
			// });
			APP.removeChild({
				model: true
			});
		}
	},
	/**
	 * Toggles the Slide Menu
	 */
	toggleMenu: function(_position) {
		if(APP.SlideMenuOpen) {
			APP.closeMenu();
		} else {
			APP.openMenu();
		}
	},
	/**
	 * Opens the Slide Menu
	 */
	openMenu: function() {
		APP.SlideMenu.Wrapper.left = "0dp";

		APP.GlobalWrapper.animate({
			left: "200dp",
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		APP.SlideMenuOpen = true;
	},
	/**
	 * Closes the Slide Menu
	 */
	closeMenu: function() {
		APP.GlobalWrapper.animate({
			left: "0dp",
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		APP.SlideMenuOpen = false;
	},
	/**
	 * Shows the loading screen
	 */
	openLoading: function() {
		APP.cancelLoading = false;

		setTimeout(function() {
			if(!APP.cancelLoading) {
				APP.loadingOpen = true;

				APP.GlobalWrapper.add(APP.Loading);
			}
		}, 100);
	},
	/**
	 * Closes the loading screen
	 */
	closeLoading: function() {
		APP.cancelLoading = true;

		if(APP.loadingOpen) {
			APP.GlobalWrapper.remove(APP.Loading);

			APP.loadingOpen = false;
		}
	},

	/**
	 * switch cuttent language
	 */
	switchLang: function(lang, pageIndex) {
		if(!pageIndex) {
			pageIndex = APP.currentStack;
		}
		Ti.App.Properties.setString('lang', lang);
		APP.langObj = require('langs/' + lang);
		APP.CurrentLanguage = lang;
		APP.ImagesFolder = '/images/' + lang + '/';
		if(pageIndex !== undefined) {
			APP.rebuild(pageIndex);
		}
		Ti.API.info('switch language:==========' + lang);
	},

	/*
	 * get language with key
	 */
	L: function(key) {
		try {
			text = APP.langObj[key];
			//Ti.API.info('language text:==========' + text);
			if(text) {
				return text;
			}
			return key;
		} catch(e) {
			APP.log('error', e);
			alert(e);
		}
	},

	/**
	 * Logs all console data
	 * @param {String} _severity A severity type (debug, error, info, log, trace, warn)
	 * @param {String} _text The text to log
	 * @param {String} _positionDesc The description of the position, etc. file name and line
	 * @param {Bool} _dumpObj Show the object to log
	 */
	log: function(_severity, _text, _positionDesc, _dumpObj) {
		if(_dumpObj) {
			_text = JSON.stringify(_text);
		}
		if(_positionDesc) {
			_text = '=====' + _positionDesc + '====' + _text;
		}
		switch(_severity.toLowerCase()) {
			case "debug":
				Ti.API.debug(_text);
				break;
			case "error":
				Ti.API.error(_text);
				break;
			case "info":
				Ti.API.info(_text);
				break;
			case "log":
				Ti.API.log(_text);
				break;
			case "trace":
				Ti.API.trace(_text);
				break;
			case "warn":
				Ti.API.warn(_text);
				break;
		}

		if(APP.LogToDB) {
			var db = Ti.Database.open(APP.Database);

			var time = new Date().getTime();
			var type = UTIL.escapeString(_severity);
			var message = UTIL.escapeString(_text);

			db.execute("UPDATE log SET time = " + time + ", type = " + type + ", message = " + message + " WHERE time = (SELECT min(time) FROM log);");
			db.close();
		}
	},
	/**
	 * Sends the log files via e-mail dialog
	 */
	logSend: function() {
		var db = Ti.Database.open(APP.Database);
		var data = db.execute("SELECT * FROM log WHERE message != \"\" ORDER BY time DESC;");

		var log = "\n\n=====\n\n" + APP.ID + " " + APP.VERSION + " (" + APP.CVERSION + ")\n" + APP.Device.os + " " + APP.Device.version + " (" + APP.Device.name + ") " + Ti.Platform.locale + "\n\n";

		while(data.isValidRow()) {
			log += "[" + data.fieldByName("type") + "] " + data.fieldByName("message") + "\n";

			data.next();
		}

		log += "\n=====";

		data.close();
		db.close();

		var email = Ti.UI.createEmailDialog({
			barColor: APP.Settings.colors.primary,
			subject: "Application Log",
			messageBody: log
		});

		if(email.isSupported) {
			email.open();
		}
	},
	/**
	 * Global orientation event handler
	 * @param {Object} _event Standard Titanium event callback
	 */
	orientationObserver: function(_event) {
		APP.log("debug", "APP.orientationObserver");

		if(APP.Device.statusBarOrientation && APP.Device.statusBarOrientation == _event.orientation) {
			return;
		}

		APP.Device.statusBarOrientation = _event.orientation;

		APP.Device.orientation = (_event.orientation == Ti.UI.LANDSCAPE_LEFT || _event.orientation == Ti.UI.LANDSCAPE_RIGHT) ? "LANDSCAPE" : "PORTRAIT";

		Ti.App.fireEvent("APP:orientationChange");
	},
	/**
	 * Global network event handler
	 * @param {Object} _event Standard Titanium event callback
	 */
	networkObserver: function(_event) {
		APP.log("debug", "APP.networkObserver");

		APP.Network.type = _event.networkTypeName;
		APP.Network.online = _event.online;

		Ti.App.fireEvent("APP:networkChange");
	},
	/**
	 * Exit event observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	exitObserver: function(_event) {
		APP.log("debug", "APP.exitObserver");
	},
	/**
	 * Resume event observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	resumeObserver: function(_event) {
		APP.log("debug", "APP.resumeObserver");
	},
	/**
	 * Back button observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	backButtonObserver: function(_event) {
		APP.log("debug", "APP.backButtonObserver");

		if(APP.modalStack.length > 0) {
			APP.removeChild({
				modal: true
			});

			return;
		} else {
			var stack;

			if(APP.Device.isHandheld || !APP.hasDetail) {
				stack = APP.controllerStacks[APP.currentStack];
			} else {
				stack = APP.detailStacks[APP.currentDetailStack];
			}

			if(stack.length > 1) {
				APP.removeChild({
					animation: APP.AnimationStyle.SlideLeft
				});;
			} else {
				APP.MainWindow.close();
			}
		}
	},
	/*
	 * Animation style
	 * all animations are support ios and android
	 */
	AnimationStyle: {
		//no animation
		None: 0,
		//fade animation
		Fade: 1,
		//Slide with left animation
		SlideLeft: 2,
		//Slide with right animation
		SlideRight: 3,
		//slide with up animation, just like a popup modle windows
		SlideUp: 4,
		//slide with down animation, just like close a modle windows
		SlideDown: 5
	}
};

module.exports = APP;