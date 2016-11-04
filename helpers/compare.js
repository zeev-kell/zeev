// # Compare Helper
// Usage: `{{compare 1 1}}`, `{{compare updated_at 2016-10}}`

var compare = function(lvalue, rvalue, options) {
    if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        return;
    }
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
        '&&': function(l, r) {
            return l && r;
        },
        '||': function(l, r) {
            return l || r;
        },
        'typeof': function(l, r) {
            return typeof l == r;
        }
    }
    if (!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    var result = operators[operator](lvalue, rvalue);
    if (options.hash.not_render) {
        return result;
    }
    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

module.exports = compare;
