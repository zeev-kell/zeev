// # Debug helper
// Usage: `{{Debug this}}`
//

var hbs = require('express-hbs'),
    utils = require('../utils'),
    util = require('util'),
    debug = require('debug')('zeev:helper'),
    _debug;

_debug = function(context, options) {
    return JSON.stringify(context);
};

module.exports = _debug;
