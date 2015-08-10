define('selector', [], function () {
    return function (selector) {
        return function $(selector) {
            selector = trim(selector);
            var arr = [];
            var space = selector.indexOf(' ');
            if (space != -1) {
                arr = selector.split(/\s+/);
                for (var i = arr.length; i > 1; i++) {
                    return query(arr[i - 1], arr[i - 2]);
                }
            } else {
                return query(selector);
            }
            function query(selector, oParent) {
                if (arr[0]) {
                    oParent = $(arr[0]);
                } else {
                    oParent = document;
                }
                switch (selector.charAt(0)) {
                case '#':
                    return document.getElementById(selector.substring(1));
                    break;
                case '.':
                    return getClass(oParent, selector.substring(1));
                    break;
                case '[':
                    return getQueryAttr(selector);
                    break;
                default:
                    if (selector.indexOf('.') != -1) {
                        var defArr = selector.split('.');
                        return getClass(oParent, defArr[1], defArr[0]);
                    } else if (selector.indexOf('[') != -1) {
                        var defArr = selector.split('[');
                        defArr[1] = '[' + defArr[1];
                        return getQueryAttr(defArr[1], defArr[0]);
                    } else {
                        return oParent.getElementsByTagName(selector)[0];
                    }
                    break;
                }
            }
            function getQueryAttr(attr, tagName) {
                tagName = tagName || '*';
                var aElem = document.getElementsByTagName(tagName);
                attr = attr.substring(1, attr.length - 1);
                if (attr.indexOf('=') != -1) {
                    var arr = attr.split('=');
                    for (var i = 0; i < aElem.length; i++) {
                        if (aElem[i].getAttribute(arr[0]) == arr[1]) {
                            return aElem[i];
                        }
                    }
                } else {
                    for (var i = 0; i < aElem.length; i++) {
                        if (aElem[i].getAttribute(attr) || aElem[i].getAttribute(attr) == '') {
                            return aElem[i];
                        }
                    }
                }
                return '';
            }
            function getClass(oParent, oClass, tagName) {
                tagName = tagName || '*';
                var aElem = oParent.getElementsByTagName(tagName);
                var arr = [];
                for (var i = 0; i < aElem.length; i++) {
                    if (aElem[i].className) {
                        var classNames = trim(aElem[i].className);
                        var arr2 = classNames.split(/\s+/);
                        for (var j = 0; j < arr2.length; j++) {
                            if (arr2[j] === oClass) {
                                return aElem[i];
                            }
                        }
                    }
                }
                return '';
            }
            function trim(str) {
                var re = /^\s+|\s+$/g;
                return str.replace(re, '');
            }
        }(selector);
    };
});