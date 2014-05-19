/**
 * The tab bar widget
 *
 * @class Widgets.com.mcongrove.tabs
 */

$.useHoverTabIcon = false;
/**
 * Initializes the tab bar
 * @param {Object} _params
 * @param {Array} _params.nodes The nodes (tab items) to show in the TabGroup as defined by the JSON configuration file
 * @param {String} _params.more The image for the "..." (more) tab
 * @param {Object} _params.color The colors to use for the tab bar
 * @param {String} _params.color.background The background of the tab bar (hex)
 * @param {String} _params.color.active The background of an active tab (hex)
 * @param {String} _params.color.text The tab text color (hex)
 * @param {Boolen} _params.useHoverTabIcon Whether use the hover image for tab icon
 */
$.init = function(_params) {
    $.nodes = [];
    $.excess = false;
    $.excessLength = 5;
    $.moreOpen = false;
    $.width = 0;
    $.display = {
        width: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
        height: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
        dpi: Ti.Platform.displayCaps.dpi
    };

    $.useHoverTabIcon = _params.useHoverTabIcon;

    if(OS_ANDROID) {
        $.display.width = ($.display.width / ($.display.dpi / 160));
        $.display.height = ($.display.height / ($.display.dpi / 160));
    }

    if(Alloy.isTablet) {
        $.excessLength = Math.floor($.display.width / 70);
    }

    if(_params.nodes.length > $.excessLength) {
        $.excess = true;
    }

    $.width = $.excess ? Math.floor($.display.width / $.excessLength) : Math.floor($.display.width / _params.nodes.length);

    $.TabGroup.backgroundColor = _params.color.background;
    //$.TabGroup.backgroundImage = WPATH('/bg-tab.png');
    $.TabContainerMore.backgroundColor = _params.color.background;
    $.Indicator.backgroundColor = _params.color.active;
    $.IndicatorMore.backgroundColor = _params.color.active;

    $.IndicatorContainer.width = $.display.width + "dp";
    $.Indicator.width = $.width + "dp";
    $.IndicatorMore.width = $.width + "dp";
    $.TabContainer.width = $.display.width + "dp";
    $.TabGroupMore.width = $.display.width + "dp";
    $.TabContainerMore.width = $.width + "dp";

    for(var i = 0; i < _params.nodes.length; i++) {
        if($.excess && i == ($.excessLength)) {
            addMoreTab(_params);
        }

        var tab = Ti.UI.createView({
            id: _params.nodes[i].id,
            width: $.width + "dp",
            height: "60dp",
            bottom: "0dp",
            left: "0dp"
        });

        var label = Ti.UI.createLabel({
            text: _params.nodes[i].title,
            top: "42dp",
            left: "5dp",
            right: "5dp",
            width: Ti.UI.FILL,
            height: "15dp",
            font: {
                fontSize: "10dp",
                fontFamily: "HelveticaNeue"
            },
            color: _params.color.text,
            textAlign: "center",
            touchEnabled: false
        });

        if(_params.nodes[i].image) {
            var icon = Ti.UI.createImageView({
                name: _params.nodes[i].iconName,
                image: _params.nodes[i].image,
                width: _params.nodes[i].width? _params.nodes[i].width: "32dp",
                height: _params.nodes[i].height? _params.nodes[i].height:"32dp",
                top: _params.nodes[i].top? _params.nodes[i].top:"7dp",
                touchEnabled: false,
                preventDefaultImage: true
            });

            tab.add(icon);
        }

        tab.add(label);

        if($.excess && i >= ($.excessLength )) {
            tab.width = $.width + "dp";
            label.left = "5dp";

            $.nodes.push(tab);

            $.TabsMore.add(tab);
        } else {
            $.nodes.push(tab);
        }
    }

    for(var i = 0, z = $.excessLength; i < z; i++) {
        if($.nodes[i]) {
            $.Tabs.add($.nodes[i]);
        }
    }
};

/**
 * Adds the 'more' tab if necessary
 * @param {Object} _params
 * @private
 */
function addMoreTab(_params) {
    var tab = Ti.UI.createView({
        width: $.width + "dp"
    });

    var icon = Ti.UI.createImageView({
        image: _params.more,
        width: "32dp",
        height: "32dp",
        top: "7dp",
        touchEnabled: false,
        preventDefaultImage: true
    });

    var label = Ti.UI.createLabel({
        text: "More",
        top: "43dp",
        left: "5dp",
        right: "5dp",
        width: Ti.UI.FILL,
        height: "13dp",
        font: {
            fontSize: "10dp",
            fontFamily: "HelveticaNeue"
        },
        color: _params.color.text,
        textAlign: "center",
        touchEnabled: false
    });

    tab.add(icon);
    tab.add(label);

    tab.addEventListener("click", moreEvent);

    $.nodes.push(tab);
};

/**
 * Clears all items from the tab bar
 */
$.clear = function() {
    var children = $.Tabs.children;
    var childrenMore = $.TabsMore.children;

    for(var i = 0; i < children.length; i++) {
        $.Tabs.remove(children[i]);
    }

    for(var i = 0; i < childrenMore.length; i++) {
        $.TabsMore.remove(childrenMore[i]);
    }
};

/**
 * Sets the indexed item as active
 * @param {Object} _index The index of the item to show as active
 */
$.setIndex = function(_index) {

    //Ti.API.info('Tabs.children========:' + JSON.stringify($.Tabs.children[_index].children[0]));
    if($.excess && _index > ($.excessLength - 2)) {
        _moreIndex = _index - ($.excessLength - 1);
        _index = ($.excessLength - 1);

        $.IndicatorMore.visible = true;
        $.IndicatorMore.top = ((_moreIndex * 60)) + "dp";
    } else {
        $.IndicatorMore.visible = false;
    }

    if($.useHoverTabIcon){
        _.each($.Tabs.children, function(item, index){
            $.Tabs.children[index].children[0].image = $.Tabs.children[index].children[0].image.replace('_on','_off');
            if(index == _index && $.Tabs.children[index].children[0].image.indexOf('_off')>0){
                $.Tabs.children[index].children[0].image = $.Tabs.children[index].children[0].image.replace('_off','_on');
            }
        });
    }

    $.Indicator.left = (_index * $.width) + "dp";
    $.Indicator.width = $.width + "dp";

    moreClose();
};

/**
 * Handles the click event on the 'more' tab
 * @param {Object} _event The event
 * @private
 */
function moreEvent(_event) {
    if($.moreOpen) {

        var animation = Titanium.UI.createAnimation({
            height: "60dp",
            duration: 100,
            curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
        });

        $.Wrapper.animate(animation);

        $.moreOpen = false;
    } else {
        $.moreOpen = true;

        var animation = Titanium.UI.createAnimation({
            height: Ti.UI.SIZE,
            duration: 100,
            curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
        });

        $.Wrapper.animate(animation);
    }
};

/**
 * Hide the menu
 * @param  {[type]} _contentWrapper , pass the content wrapper for change the bottom for hide the tabs menu
 * @return {[type]}                 [description]
 */
$.hideMenu = function(_contentWrapper){
    $.Wrapper.visible = false;
    _contentWrapper.bottom = 0;
};

/**
 * Show the tab menu
 * @param  {[type]} _contentWrapper [description]
 * @return {[type]}                 [description]
 */
$.showMenu = function(_contentWrapper){
    $.Wrapper.visible = true;
    _contentWrapper.bottom = "60dp";
};

/**
 * Closes the 'more' tab
 * @private
 */
function moreClose() {
    $.Wrapper.height = "60dp";
    $.moreOpen = false;
};

$.Wrapper.addEventListener("click", function(_event) {
    if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
        $.setIndex(_event.source.id);
    }
});