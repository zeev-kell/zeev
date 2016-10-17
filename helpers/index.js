var errors = require('../errors');
var moment = require("moment");
moment.locale('zh-cn');

var coreHelpers = {};
coreHelpers.compare = require('./compare');
coreHelpers.asset = require('./asset');

module.exports.registerHelpers = function(hbs) {

    hbs.registerHelper('moment', function(context, options) {
        var format = options.hash && options.hash.format || 'lll';
        return moment(context).format(format);
    });

    hbs.registerHelper('compare', coreHelpers.compare);
    hbs.registerHelper('asset', coreHelpers.asset);

}
