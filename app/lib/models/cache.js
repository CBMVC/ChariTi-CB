/**
 * Cache model
 *
 * @class Models.cache
 * @uses core
 * @uses http
 * @uses utilities
 */
var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID = 0;

	/**
	 * Initializes the model
	 * @param {Number} _id The UID of the component
	 */
	this.init = function() {
		APP.log("debug", "Cache.init()");

		//TID = 0;

		var db = Ti.Database.open(APP.Database);

		db.execute("CREATE TABLE IF NOT EXISTS Cache_" + TID + " (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value TEXT, expried INTEGER);");
		//reset the cache table
		db.execute("DELETE FROM Cache_" + TID + ";");
		db.close();
	};

	/**
	 * Get the cache value by key
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.url The URL to retrieve data from
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.get = function(_key) {
		APP.log("debug", _key, "Cache.get 42 in model");

		var db = Ti.Database.open(APP.Database);
		var data = db.execute("SELECT * FROM Cache_" + TID + " WHERE key = " + UTIL.cleanEscapeString(_key) + ";");
		var temp, expried = 0;

		while(data.isValidRow()) {
			//APP.log('debug', data.fieldByName("value").replace(/'/g, "\""), 'cache model 49', true);
			temp = JSON.parse(data.fieldByName("value").replace(/'/g, "\""));
			expried = data.fieldByName("expried");
			data.next();
		}

		if(expried == 0) {
			expried = APP.CacheDuration;
		}

		var isStale = UTIL.isStale("CacheData_" + _key, expried);

		if(isStale) {
			if(APP.CacheDuration !== 0 && isStale !== "new") {
				return null;
			}

			data.close();
			db.close();

			return temp;
		} else {
			//delete the expried cache data
			db.execute("DELETE FROM Cache_" + TID + " WHERE key = " + UTIL.cleanEscapeString(_key) + ";");
			db.execute("DELETE FROM updates WHERE url = " + UTIL.escapeString("CacheData_" + _key) + ";");
			db.close();
			return null;
		}
	};

	/**
	 * Set the cache data
	 * @param {String} _key The cache key
	 * @param {Object} _value The cache value
	 * @param {Int} _experied The cache experied time, in minutes, if null then use the globals cache duration
	 */
	this.set = function(_key, _value, _experied) {
		APP.log("debug", _value, "Cache.set 85 in model", true);

		if(_value) {
			if(!_experied) {
				_experied = 0;
			}
			var db = Ti.Database.open(APP.Database);
			//delete the existing cache item
			db.execute("DELETE FROM Cache_" + TID + " WHERE key = " + UTIL.cleanEscapeString(_key) + ";");
			db.execute("BEGIN TRANSACTION;");

			db.execute("INSERT INTO Cache_" + TID + " (id, key, value, expried) VALUES (NULL, " + UTIL.escapeString(_key) + ", " + UTIL.escapeString(JSON.stringify(_value)) + ", " + _experied + ");");

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString("CacheData_" + _key) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}
	};

	/**
	 * Remove the cache by key
	 * @param  {[type]} _key The cache key
	 */
	this.remove = function(_key) {
		APP.log("debug", _key, "Cache.remove 110 in model");

		if(_key) {
			var db = Ti.Database.open(APP.Database);
			//delete the existing cache item
			db.execute("DELETE FROM Cache_" + TID + " WHERE key = " + UTIL.cleanEscapeString(_key) + ";");

			db.execute("DELETE FROM updates WHERE url = " + UTIL.escapeString("CacheData_" + _key) + ";");

			db.close();
		}
	};

	/**
	 * Clean all cache data
	 */
	this.clean = function() {
		var db = Ti.Database.open(APP.Database);
		//delete the existing cache item
		db.execute("DELETE FROM Cache_" + TID + ";");
		db.execute("DELETE FROM updates WHERE url LIKE 'CacheData_%';");
		db.close();
	}

}

module.exports = function() {
	return new Model();
};