ChariTi-CB
==========

[ChariTi](https://github.com/mcongrove/ChariTi) is a great alloy framework, and it's open source!

This is a ChariTi enhancement version by me, I have added more features within ChariTi framework :)

The ChariTi-CB version will synchronizes with ChariTi.

# Version 1.2 Changs

 1. Add a cache function. It will add the object and data into local sqliste database.

	***How to use:***

	1) Add the `APP.CacheModel = require("models/cache")();` into your
   /app/controller/index.js
   
	2) Add object into cache:  `APP.CacheModel.set('cacheKey', object, 5);` , the last parameter is experied time, the unit is minutes.
		
	3) Get object from cache:  `APP.CacheModel.set('cacheKey')`
	
	4) You can set the cache duration in `app/lib/data/app.json` file: `"cacheDuration": 5,`, the unit is minutes.
	
2. Added two the navigation animations, they are `APP.AnimationStyle.NavLeft` and `APP.AnimationStyle.NavRight`, these animation will same with the iOS navigation window effect, and it also support android.

	***How to use:***
	
	Just pass the `APP.AnimationStyle.NavLeft` or `APP.AnimationStyle.NavRight` to `APP.addScreen` function's animationStyle is ok.
	
3. Added a callback function into `APP.addScreen` function, you can also pass a callback in it.

	***How to use:***
	
	```javascript
	APP.addChild({
		controller: "page3",
		animation: APP.AnimationStyle.NavLeft,
		callback: function() {
			APP.log('info', 'callback in page 2 in line 20');
			APP.Tabs.hideMenu(APP.ContentWrapper);
		}
	});
	```

4. Add a hover tab icon in the tab menu. By default, ChariTi's tab menu just can set one icon and use a hover layer for show the current tab, and now you can use a difference hover icon for the current tab

	***How to use:***
	
	1) Change the setting `"useHoverTabIcon"` to `true` in `/app/lib/data/app.json`
	
	2) Prepare two icons file and with name `xxx_on.png` and `xxx_off.png` into `/assets/icons/white(or your theme folder)/` folder
	
	3) Set the icon name to tab within `/app/lib/data/app.json` file:
	
	```javascript
	{
		"title": "Home", 
        "type": "place_list",
		"image": "home", //this is the icon file name, so should be a home_on.png and home_off.png in your icon folder
		"tabletSupport": false
	},
	```

5. Integrate [wriststrap](https://github.com/TNuzzi/wriststrap) layout framework. This is a awesome framework for the layout and tss, it use the css style for the view, but there are some feature not support android, but most of them is works.


