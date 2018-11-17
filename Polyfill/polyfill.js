/**
 * 【补充类】
 */

// requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// bind 兼容 IE7-8
Function.prototype.bind = Function.prototype.bind || function (context) {
    if (typeof this !== 'function') {
        throw new Error('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};

/**
 * 【兼容类】
 */
var util = {
    extend: function (target) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            for (var prop in arguments[i]) {
                if (arguments[i].hasOwnProperty(prop)) {
                    target[prop] = arguments[i][prop];
                }
            }
        }
        return target;
    },
    getStyle: function (element, prop) {
        return element.currentStyle ? element.currentStyle[prop] : document.defaultView.getComputedStyle(element)[prop]
    },
    getScrollOffsets: function () {
        var w = window;
        if (w.pageXOffset != null) {
            return {
                x: w.pageXOffset,
                y: w.pageYOffset
            };
        }
        var d = w.document;
        if (d.compatMode == 'CSS1Compat') {
            return {
                x: d.documentElement.scrollLeft,
                y: d.documentElement.scrollTop
            }
        }
        return {
            x: d.body.scrollLeft,
            y: d.body.scrollTop
        }
    },
    setOpacity: function (element, opacity) {
        if (element.style.opacity != undefined) {
            element.style.opacity = opacity / 100;
        }
        else {
            element.style.filter = 'alpha(opacity='+ opacity +')';
        }
    },
    fadeIn: function (element, speed) {
        var opacity = 0;
        util.setOpacity(element, 0);
        var timer;

        function step() {
            util.setOpacity(element, opacity += speed);
            if (opacity < 100) {
                timer = requestAnimationFrame(step);
            }
            else {
                cancelAnimationFrame(timer);
            }
        }
        requestAnimationFrame(step);
    },
    fadeOut: function (element, speed) {
        var opacity = 100;
        util.setOpacity(element, 100);
        var timer;

        function step() {
            util.setOpacity(element, opacity -= speed);
            if (opacity > 0) {
                timer = requestAnimationFrame(step);
            }
            else {
                cancelAnimationFrame(timer);
            }
        }
        requestAnimationFrame(step);
    },
    addEvent: function (element, type, fn) {
        if (document.addEventListener) {
            element.addEventListener(type, fn, false);
            return fn;
        }
        else if (document.attachEvent) {
            var bound = function () {
                return fn.apply(element, arguments)
            };
            element.attachEvents('on' + type, bound);
            return bound;
        }
    },
    indexOf: function (array, item) {
        var result = -1;
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === item) {
                result = i;
                break;
            }
        }
        return result;
    },
    addClass: function (element, className) {
        var classNames = element.className.split(/\s+/);
        if (util.indexOf(classNames, className) === -1) {
            classNames.push(className);
        }
        element.className = classNames.join(' ');
    },
    removeClass: function (element, className) {
        var classNames = element.className.split(/\s+/);
        var index = util.indexOf(classNames, className);
        if (index !== -1) {
            classNames.splice(index, 1);
        }
        element.className = classNames.join(' ');
    }
};

