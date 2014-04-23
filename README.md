ChariTi-CB
==========

[ChariTi](https://github.com/mcongrove/ChariTi) is a great alloy framework, and it's open source!

This is a ChariTi enhancement version by me, I have added more features within ChariTi framework :)

The ChariTi-CB version will synchronizes with ChariTi.

There are following enhancement with ChariTi-CB in version 1.2.2

### 1. Support custom multiple language. You can switch the current language in the code and don't need to base on the phone setting.

#### How to use:
    1) Set the default lanuguage in the /lib/data/app.json file:  `"defaultLanguage": "en",`
    2) Create the language key/value resource file and put in the /lib/langs folder, ect. `en.js`
    3) Use the `APP.L('langKey')` for display the language content.
    4) Use the `APP.switchLang('en');` to switch the current to `en`, and you can get the current language with `APP.CurrentLanguage`.
    5) For the tab text, the tab's title in the app.json file is the language resource's key.
    6) If you don't need to support multiple language, just set the `"isMultiLanguage"` to false in the app.json file.

### 2. Support slide left, right, top and down animation when you switch the page.

#### How to use:
In ChariTi, you can use `APP.addChild` to switch the page, and in ChariTi-CB, I have enhance this function, the following is the function signature:

    /**
     * Open a child screen
     * @param {String} controller The name of the controller to open
     * @param {Object} params An optional dictionary of parameters to pass to the controller
     * @param {Boolean} modal Whether this is for the modal stack
     * @param {Boolean} sibling Whether this is a sibling view
     * @param {Boolean} animation The animation of the navigation
     */
    addChild: function(_params)

You can pass the animation in to this function like follow:

    APP.addChild({
        controller: "article_article",
        params: {
            id: _data[0].id,
            index: CONFIG.index
        },
        animation: APP.AnimationStyle.SlideRight
    });

    And the animation style support following values:

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

When you use the slide right animation to next page, you should also want to use the slide left within the back function, so you can put the following code in the back button event:

    $.NavigationBar.showBack(function(_event) {
        APP.removeChild({
            animation: APP.AnimationStyle.SlideLeft
        });
    });

### 3. You can change the Database name in the core.js file in line 122.

### 4. For some reasons, maybe you don't want to use the ChariTi default setting button, so in this time, you can easy set the `useDefaultSettingButton` to false in the app.json file.

### 5. Enhance the `APP.log` function. You can dump the js object in this function. Follow is the function signature:

    /**
     * Logs all console data
     * @param {String} _severity A severity type (debug, error, info, log, trace, warn)
     * @param {String} _text The text to log
     * @param {String} _positionDesc The description of the position, etc. file name and line
     * @param {Bool} _dumpObj Show the object to log
     */
    log: function(_severity, _text, _positionDesc, _dumpObj)

For example, if you want to show the array object, you can use follow :

    var tmpObj = {
        id: 1,
        name: 'test'
    }

    APP.log('debug', tmpObj, 'in test file line 10', true);

Then the result will be:

    {id:1,name:'test'}=====in test file line 10

### 6. By default, ChariTi will save all default information into DB, if you don't want to do it, you can set the `logToDB` to false in app.json.

### 7. Enhance the update function, you can set the app store and google play url in app.json, if the `minimumVersion` is not support udpate, the app can popup the user go to the app store(android with google play) for download the app.























