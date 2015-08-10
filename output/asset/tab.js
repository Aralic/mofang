define('tab', [
    'require',
    'exports',
    './selector',
    './util',
    './tabData'
], function (require, exports) {
    var $ = require('./selector');
    var _ = require('./util');
    var $banner = $('#banner');
    var $bannerTab = $('#banner .banner-tab');
    var $bannerDot = $('#banner .banner-dot');
    var $tabLi;
    var $dotLi;
    var timer;
    var TAB_LENGTH;
    var index = 0;
    var view = function () {
        return {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        };
    };
    var WIDTH = view().w;
    function Tab() {
    }
    Tab.prototype = {
        constructor: 'Tab',
        init: function () {
            this.render();
        },
        render: function () {
            var data = require('./tabData');
            var tabHtml = '';
            var dotHtml = '';
            TAB_LENGTH = data.length;
            data.forEach(function (item, index) {
                tabHtml += '' + '<li class="banner-tab-item" data-index="' + index + '">' + '<a href="#">' + '<img src="' + item.src + '" class="banner-pic">' + '<p class="banner-info">' + item.info + '</p>' + '</a>' + '</li>';
                dotHtml += '<li class="banner-dot-item" data-index="' + index + '"></li>';
            });
            $bannerTab.innerHTML = tabHtml;
            $bannerDot.innerHTML = dotHtml;
            $tabLi = $bannerTab.getElementsByTagName('li');
            $dotLi = $bannerDot.getElementsByTagName('li');
            $bannerTab.style.webkitTransform = 'translateX(0%)';
            $bannerTab.style.transform = 'translateX(0%)';
            $bannerTab.style.transition = '300ms ease-out';
            _.addClass($dotLi[0], 'active');
            this.bind();
        },
        bind: function () {
            this.autoPlay();
            this.touch();
        },
        autoPlay: function () {
            timer = setInterval(this.setPlay, 4000, -1);
        },
        setPlay: function (dir) {
            var previous = index;
            dir = dir || 0;
            if (dir == -1) {
                index++;
            } else if (dir == 1) {
                index--;
            }
            var L = -index * WIDTH + 'px';
            $bannerTab.style.webkitTransition = '300ms ease-out';
            $bannerTab.style.webkitTransform = 'translateX(' + L + ')';
            if (index == TAB_LENGTH) {
                $tabLi[0].style.left = TAB_LENGTH * WIDTH + 'px';
                setTimeout(function () {
                    $tabLi[0].style.left = '0';
                    $bannerTab.style.webkitTransition = 'none';
                    $bannerTab.style.webkitTransform = 'translateX(0)';
                }, 400);
                index = 0;
            } else if (index == -1) {
                $tabLi[TAB_LENGTH - 1].style.left = -TAB_LENGTH * WIDTH + 'px';
                setTimeout(function () {
                    $tabLi[TAB_LENGTH - 1].style.left = '0';
                    $bannerTab.style.webkitTransition = 'none';
                    $bannerTab.style.webkitTransform = 'translateX(' + (TAB_LENGTH - 1) * -WIDTH + 'px)';
                }, 400);
                index = TAB_LENGTH - 1;
            }
            _.removeClass($dotLi[previous], 'active');
            _.addClass($dotLi[index], 'active');
        },
        touch: function () {
            var that = this;
            var startLeft;
            var moveX;
            var setTimer = null;
            var fnStart = function (ev) {
                clearInterval(timer);
                clearTimeout(setTimer);
                var touch = ev.changedTouches[0];
                startLeft = touch.screenX;
            };
            var fnMove = function (ev) {
                var touch = ev.changedTouches[0];
                moveX = touch.screenX - startLeft;
                var disX = -index * WIDTH + moveX;
                if (disX < -(TAB_LENGTH - 1) * WIDTH) {
                    $tabLi[0].style.left = TAB_LENGTH * WIDTH + 'px';
                } else if (disX > 0) {
                    $tabLi[TAB_LENGTH - 1].style.left = -TAB_LENGTH * WIDTH + 'px';
                }
                $bannerTab.style.webkitTransform = 'translateX(' + disX + 'px)';
                $bannerTab.style.transform = 'translateX(' + disX + 'px)';
                $bannerTab.style.transition = 'none';
            };
            var fnEnd = function (ev) {
                var dir = Math.round(moveX / WIDTH);
                that.setPlay(dir);
                setTimer = setTimeout(function () {
                    timer = setInterval(that.setPlay, 4000, -1);
                }, 400);
            };
            _.addEvent($bannerTab, 'touchstart', fnStart);
            _.addEvent($bannerTab, 'touchmove', fnMove);
            _.addEvent($bannerTab, 'touchend', fnEnd);
        }
    };
    exports.Tab = Tab;
});