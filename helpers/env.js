/**
 * Created by zeev on 2016/10/30 0030.
 */
// # env helper
// Usage: `{{env product="true"}}{{/env}}`
//

var hbs   = require('express-hbs'),
    utils = require('../utils'),
    debug = require('debug')('zeev:helper'),
    env;

env = function (options) {

    // render_with_product
    var r_w_p = (options.hash.product == true || options.hash.product == "true");

    if (r_w_p) {
        if (utils.isProduction) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    } else {
        if (utils.isDevelopment) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }


};

module.exports = env;
