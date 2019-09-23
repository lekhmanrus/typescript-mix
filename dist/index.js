"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mix(client, mixins) {
    var clientKeys = Object.getOwnPropertyNames(client.prototype);
    for (var _i = 0, mixins_1 = mixins; _i < mixins_1.length; _i++) {
        var mixin = mixins_1[_i];
        var mixinMixables = getMixables(clientKeys, mixin);
        Object.defineProperties(client.prototype, mixinMixables);
    }
}
/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(clientKeys, mixin) {
    var descriptors = {};
    switch (typeof mixin) {
        case "object":
            descriptors = getMixables(mixin);
            break;
        case "function":
            descriptors = getMixables(mixin.prototype);
            break;
    }
    return descriptors;
    function getMixables(obj) {
        var map = {};
        var base = Object.getPrototypeOf(obj);
        if (base !== Object.prototype) {
          var baseDescriptors = getMixables(base) || {};
          for (var i in baseDescriptors) {
            map[i] = baseDescriptors[i];
          }
        }
        Object.getOwnPropertyNames(obj).map(function (key) {
            if (clientKeys.indexOf(key) < 0) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor === undefined)
                    return;
                if (descriptor.get || descriptor.set) {
                    map[key] = descriptor;
                }
                else if (typeof descriptor.value === "function") {
                    map[key] = descriptor;
                }
            }
        });
        return map;
    }
}
/**
 * Takes a list of classes or object literals and adds their methods
 * to the class calling it.
 */
function use() {
    var options = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        options[_i] = arguments[_i];
    }
    return function (target, propertyKey) {
        mix(target.constructor, options.reverse());
    };
}
exports.use = use;
/**
 * Takes a method as a parameter and add it to the class calling it.
 */
function delegate(method) {
    return function (target, propertyKey) {
        target.constructor.prototype[propertyKey] = method;
    };
}
exports.delegate = delegate;
//# sourceMappingURL=index.js.map