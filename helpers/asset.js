// # Asset helper
// Usage: `{{asset "css/screen.css"}}`, `{{asset "css/screen.css" ghost="true"}}`
//
// Returns the path to the specified asset. The ghost flag outputs the asset path for the Ghost admin

var hbs = require('express-hbs'),
    utils = require('../utils'),
    debug = require('debug')('zeev:helper'),
    asset;

asset = function(context, options) {
    var output = '',
        minify = true;

    // output += config.paths.subdir + '/';

    // replace ".foo" with ".min.foo" in production
    if (utils.isProduction && minify) {
        context = context.replace('.', '.min.');
    }

    output += context;

    return new hbs.handlebars.SafeString(output);
};

module.exports = asset;
