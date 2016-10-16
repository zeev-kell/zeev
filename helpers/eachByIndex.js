// # EachByIndex Helper
// Usage: 

var appendContextPath = function(contextPath, id) {
    return (contextPath ? contextPath + '.' : '') + id;
}

var blockParams = function(params, ids) {
    params.path = ids;
    return params;
}
var EachByIndex = function(context, options) {
    if (!options) {
        throw new _Exception('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
        contextPath = appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) {
        context = context.call(this);
    }

    if (options.data) {
        data = createFrame(options.data);
    }

    function execIteration(field, index, last) {
        if (data) {
            data.key = field;
            data.index = index;
            data.first = index === 0;
            data.last = !!last;

            if (contextPath) {
                data.contextPath = contextPath + field;
            }
        }

        ret = ret + fn(context[field], {
            data: data,
            blockParams: blockParams([context[field], field], [contextPath + field, null])
        });
    }

    if (context && typeof context === 'object') {
        if (isArray(context)) {
            for (var j = context.length; i < j; i++) {
                execIteration(i, i, i === context.length - 1);
            }
        } else {
            var priorKey = undefined;

            for (var key in context) {
                if (context.hasOwnProperty(key)) {
                    // We're running the iterations one step out of sync so we can detect
                    // the last iteration without have to scan the object twice and create
                    // an itermediate keys array.
                    if (priorKey) {
                        execIteration(priorKey, i - 1);
                    }
                    priorKey = key;
                    i++;
                }
            }
            if (priorKey) {
                execIteration(priorKey, i - 1, true);
            }
        }
    }

    if (i === 0) {
        ret = inverse(this);
    }

    return ret;
};

module.exports = EachByIndex;
