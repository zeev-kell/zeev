/**
 * Created by zeev on 2016/10/13 0013.
 */

var moment = require("moment");

module.exports = function(app) {
    app.locals.moment = function(date) {
        return moment(date).format('llll');
    };
    app.locals.getParse = function(_this, _keys) {
        var keys = _keys.split(/\./);
        var value = _this[keys[0]];
        for (var i = 1, len = keys.length; i < len; i++) {
            if (value == '' || typeof value == "undefined") {
                break;
            }
            value = value[keys[i]];
        }
        return value;
    }
}
