var titleid;

if (arguments[0]) {
	applyProperties(arguments[0]);
}

function applyProperties(properties) {
	var apply = {};

	if (properties.title) {
		apply.text = properties.title;
		titleid = null;

	} else if (properties.titleid) {
		apply.text = L(properties.titleid);
		titleid = properties.titleid;
	}

	if (properties.upperCase) {
		apply.text = apply.toUpperCase();
	}

	_.extend(apply, _.pick(properties, 'color', 'font', 'shadowColor', 'shadowOffset'));

	// textAlign only works with fixed width
	if (properties.textAlign !== undefined && (properties.width || $.title.width !== 'SIZE')) {
		apply.textAlign = properties.textAlign;
		apply.width = Ti.UI.FILL;
	}

	// verticalAlign only works with fixed width
	if (properties.verticalAlign !== undefined && (properties.height || $.title.height !== 'SIZE')) {
		apply.verticalAlign = properties.verticalAlign;
		apply.height =  Ti.UI.FILL;
	}

	// Font needs to be cloned
    if (properties.font) {
        apply.font = _.clone(properties.font);
    }

	if (_.size(apply)) {
		$.title.applyProperties(apply);

        // Ti.API.info('===$.title.width:'+$.title.width+
        // '=====$.title.textAlign:'+ $.title.textAlign+
        // '=====$.title.text:'+$.title.text);
	}


}

/*** TITLE ***/

function setTitle(title) {

    return applyProperties({
        title: title
    });
}

function getTitle() {

	return $.title.text;
}

/*** TITLEID ***/

function setTitleid(titleid) {

    return applyProperties({
        titleid: titleid
    });
}

function getTitleid() {

	return titleid;
}

/*** EXPORTS ***/

exports.applyProperties = applyProperties;

exports.getTitle = getTitle;
exports.setTitle = setTitle;

exports.getTitleid = getTitleid;
exports.setTitleid = setTitleid;