define('util', [
    'require',
    'exports'
], function (require, exports) {
    return {
        hasClass: function (element, className) {
            var classNames = element.className;
            if (!classNames) {
                return false;
            }
            classNames = classNames.split(/\s+/);
            for (var i = 0, len = classNames.length; i < len; i++) {
                if (classNames[i] === className) {
                    return true;
                }
            }
            return false;
        },
        addClass: function (element, className) {
            if (!this.hasClass(element, className)) {
                element.className = element.className ? [
                    element.className,
                    className
                ].join(' ') : className;
            }
        },
        removeClass: function (element, className) {
            if (className && this.hasClass(element, className)) {
                var classNames = element.className.split(/\s+/);
                for (var i = 0, len = classNames.length; i < len; i++) {
                    if (classNames[i] === className) {
                        classNames.splice(i, 1);
                        break;
                    }
                }
                element.className = classNames.join(' ');
            }
        },
        isSiblingNode: function (element, siblingNode) {
            for (var node = element.parentNode.firstChild; node; node = node.nextSibling) {
                if (node === siblingNode) {
                    return true;
                }
            }
            return false;
        },
        show: function (element) {
            if (this.hasClass(element, 'hide')) {
                this.removeClass(element, 'hide');
            }
            this.addClass(element, 'show');
        },
        hide: function (element) {
            if (this.hasClass(element, 'show')) {
                this.removeClass(element, 'show');
            }
            this.addClass(element, 'hide');
        },
        isMobile: function () {
            return /(iPhone|iPod|Android|ios|iPad)/i.test(navigator.userAgent);
        },
        trim: function (str) {
            var re = /^\s+|\s+$/g;
            return str.replace(re, '');
        },
        getFormatDate: function () {
            var oDate = new Date();
            var str = '';
            str = oDate.getFullYear();
            str += '-' + this.addZero(oDate.getMonth() + 1) + '-' + this.addZero(oDate.getDate());
            return str;
        },
        addZero: function (sum) {
            if (sum < 10) {
                return '0' + sum;
            } else {
                return sum;
            }
        },
        addEvent: function (element, event, listener) {
            var evName = event;
            if (element.evName) {
                element.evName.push(listener);
            } else {
                element.evName = [listener];
            }
            if (element.addEventListener) {
                element.addEventListener(event, listener, false);
            } else {
                element.attachEvent('on' + event, listener);
            }
        },
        removeEvent: function (element, event, listener) {
            if (listener) {
                if (element.removeEventListener) {
                    element.removeEventListener(event, listener, false);
                } else {
                    element.detachEvent('on' + event, listener);
                }
            } else {
                if (element.evName) {
                    for (var i = 0; i < element.evName.length; i++) {
                        removeEvent(element, event, element.evName[i]);
                    }
                }
            }
        },
        delegate: function (element, tagName, eventName, listener) {
            this.addEvent(element, eventName, function (ev) {
                var ev = ev || event;
                var target = ev.target || ev.srcElement;
                if (target && target.nodeName.toLowerCase() === tagName) {
                    listener.call(target, ev);
                }
            });
        }
    };
});