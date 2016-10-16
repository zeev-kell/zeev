/**
 * Created by zeev on 2016/10/15 0012.
 */
var moment = require("moment");
moment.locale('zh-cn');

module.exports = function(hbs) {
    hbs.registerHelper('link', function(text, options) {
        var attrs = [];
        for (var prop in options.hash) {
            attrs.push(prop + '="' + options.hash[prop] + '"');
        }
        return new hbs.SafeString(
            '<a ' + attrs.join(' ') + '>' + text + '</a>'
        );
    });

    hbs.registerHelper('moment', function(date, options) {
        var format = options.hash.format || 'lll';
        return moment(date).format(format);
    });

    hbs.registerHelper('compare', function(lvalue, rvalue, options) {
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
            return;
        }
        console.log(lvalue, rvalue);
        var operator = options.hash.operator || "==";
        var operators = {
            '==': function(l, r) {
                return l == r;
            },
            '===': function(l, r) {
                return l === r;
            },
            '!=': function(l, r) {
                return l != r;
            },
            '<': function(l, r) {
                return l < r;
            },
            '>': function(l, r) {
                return l > r;
            },
            '<=': function(l, r) {
                return l <= r;
            },
            '>=': function(l, r) {
                return l >= r;
            },
            'typeof': function(l, r) {
                return typeof l == r;
            }
        }
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }
        var result = operators[operator](lvalue, rvalue);
        return result;
    });
}
