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

5. Integrate [wriststrap](https://github.com/TNuzzi/wriststrap) layout framework. This is a awesome framework for the layout and tss, it use the css style for the view, but there are some features not support on android, but most of them is works.


# Version 1.0.1

There are following enhancement with ChariTi-CB in version 1.0.1, base on ChariTi 1.2.2

#### Enhance the remove children function. Please consider the following scenarios:

There are 4 screens, you need to use the `APP.addChild` to navigate them: `screen1 -> screen2 -> screen3 -> screen4`, after you go into screen4, and you want to back to screen2, by default ChariTi just can back one screen with the `APP.removeChild()` function, or you can use the `APP.addChild` to add to screen2, but in this way, the controller stack will keep to increase, so we should use the `APP.removeChild` for remove the screen4 and screen3 after switch back to screen2. In this case, I enhanced the `APP.removeChild` function to support remove to define screen:

```javascript
        /**
         * Removes a child screen
         * @param {String} controller The controller name need to be back and remove from the stack
         * @param {Boolean} modal Removes the child from the modal stack
         * @param {Boolean} animation The animation of the navigation
         */
        removeChild: function(_params)
```

For example, in the above case, just use the function like follow:

```javascript
        APP.removeChild({
            controller: 'screen2',
            animation: APP.AnimationStyle.SlideLeft
        });
```


# Version 1.0

There are following enhancement with ChariTi-CB in version 1.0, base on ChariTi 1.2.2

* Support custom multiple language. You can switch the current language in the code and don't need to base on the phone setting.

    **How to use:**

    1) Set the default lanuguage in the /lib/data/app.json file:  `"defaultLanguage": "en",`
    2) Create the language key/value resource file and put in the /lib/langs folder, ect. `en.js`

    3) Use the `APP.L('langKey')` for display the language content.

    4) Use the `APP.switchLang('en');` to switch the current to `en`, and you can get the current language with `APP.CurrentLanguage`.

    5) For the tab text, the tab's title in the app.json file is the language resource's key.

    6) If you don't need to support multiple language, just set the `"isMultiLanguage"` to false in the app.json file.

* Support slide left, right, top and down animation when you switch the page.

    **How to use:**

 In ChariTi, you can use `APP.addChild` to switch the page, and in ChariTi-CB, I have enhance this function, the following is the function signature:

```javascript
    /**
     * Open a child screen
     * @param {String} controller The name of the controller to open
     * @param {Object} params An optional dictionary of parameters to pass to the controller
     * @param {Boolean} modal Whether this is for the modal stack
     * @param {Boolean} sibling Whether this is a sibling view
     * @param {Boolean} animation The animation of the navigation
     */
    addChild: function(_params)
```

 You can pass the animation in to this function like follow:

```javascript
    APP.addChild({
        controller: "article_article",
        params: {
            id: _data[0].id,
            index: CONFIG.index
        },
        animation: APP.AnimationStyle.SlideRight
    });
```

 And the animation style support following values:

```javascript
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
```

 When you use the slide right animation to next page, you should also want to use the slide left within the back function, so you can put the following code in the back button event:

```javascript
    $.NavigationBar.showBack(function(_event) {
        APP.removeChild({
            animation: APP.AnimationStyle.SlideLeft
        });
    });
```

* You can change the Database name in the core.js file in line 122.

* For some reasons, maybe you don't want to use the ChariTi default setting button, so in this time, you can easy set the `useDefaultSettingButton` to false in the app.json file.

* Enhance the `APP.log` function. You can dump the js object in this function. Follow is the function signature:

```javascript
    /**
     * Logs all console data
     * @param {String} _severity A severity type (debug, error, info, log, trace, warn)
     * @param {String} _text The text to log
     * @param {String} _positionDesc The description of the position, etc. file name and line
     * @param {Bool} _dumpObj Show the object to log
     */
    log: function(_severity, _text, _positionDesc, _dumpObj)
```

 For example, if you want to show the array object, you can use follow :

    var tmpObj = {
        id: 1,
        name: 'test'
    }

    APP.log('debug', tmpObj, 'in test file line 10', true);

 Then the result will be:

    {id:1,name:'test'}=====in test file line 10

* By default, ChariTi will save all debug(APP.log) information into DB, if you don't want to do it, you can set the `logToDB` to false in app.json.

* Enhance the update function, you can set the app store and google play url in app.json, if the `minimumVersion` is not support udpate, the app can popup the user go to the app store(android with google play) for download the app.
