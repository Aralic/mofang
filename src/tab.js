define(function(require, exports, module) {
    var $ = require('./selector');
    var _ = require('./util');

    /*
    * @type {elementHTML} 元素
    */ 
    var $banner = $('#banner');
    var $bannerTab = $('#banner .banner-tab');
    var $bannerDot = $('#banner .banner-dot');
    var $tabLi;
    var $dotLi;

    /*
    * @type {object} 返回定时器句柄
    */ 
    var timer;

    /*
    * @type {number} tab长度
    */
    var TAB_LENGTH;

    /*
    * @type {number} 当前索引 
    */ 
    var index = 0;

    //设备可视区宽高 
    var view = function () {
        return {
            w: document.documentElement.clientWidth,
            h: document.documentElement.clientHeight
        }
    }
    /*
    * @type {number} 可视区宽度
    */ 
    var WIDTH = view().w;

    function Tab() {

    }

    Tab.prototype = {
        constructor: 'Tab',

        init: function() {
            this.render();
        },

        // 私有方法，此处是否应该有_???
        render: function() {
            var data = require('./tabData');
            var tabHtml = '';
            var dotHtml = '';
            TAB_LENGTH = data.length;
            data.forEach(function(item, index) {
                tabHtml += ''
                    + '<li class="banner-tab-item" data-index="'+index+'">'
                    +   '<a href="#">'
                    +       '<img src="'+item.src+'" class="banner-pic">'
                    +       '<p class="banner-info">'+item.info+'</p>'
                    +   '</a>'
                    + '</li>';

                dotHtml += '<li class="banner-dot-item" data-index="'+index+'"></li>';  

            });
            $bannerTab.innerHTML = tabHtml;
            $bannerDot.innerHTML = dotHtml;
            $tabLi = $bannerTab.getElementsByTagName('li');
            $dotLi = $bannerDot.getElementsByTagName('li');

            $bannerTab.style.webkitTransform = 'translateX(0%)';
            $bannerTab.style.transform = 'translateX(0%)';
            $bannerTab.style.transition = '300ms ease-out';

            //第一个dot激活
            _.addClass($dotLi[0], 'active');
            
            this.bind();
        },

        bind: function() {
            //页面渲染完成，开始自动播放
            this.autoPlay();

            //绑定手势事件
            this.touch();
        },

        //滑屏自动播放
        autoPlay: function() {            

            timer = setInterval(this.setPlay, 4000, -1);
        },

        /*
        *  
        * @param {number}  -1表示向左滑动 1表示向右滑动 0表示回到起点
        *
        */ 
        setPlay: function(dir) {
            /*
            * @type {number} 记录之前的索引值，用于同步激活按钮
            */ 
            var previous = index;
            dir = dir || 0;             // 0 默认回到起点   

            if (dir == -1) {            // -1 <-
                index++;
            } else if (dir == 1) {      // 1 ->
                index--;
            }

            // 设定ul的X偏移量
            var L = -index * WIDTH + 'px';
                $bannerTab.style.webkitTransition = '300ms ease-out';
                $bannerTab.style.webkitTransform = 'translateX('+L+')';
            
            // 当向左滑到最后一张 或向右滑到第一张 无缝处理    
            if (index == TAB_LENGTH) {

                $tabLi[0].style.left = TAB_LENGTH * WIDTH + 'px'; 
                setTimeout(function() {
                    $tabLi[0].style.left = '0';
                    $bannerTab.style.webkitTransition = 'none';
                    $bannerTab.style.webkitTransform = 'translateX(0)';
                }, 400);

                index = 0;
            } else if (index == -1) {

                $tabLi[TAB_LENGTH-1].style.left = - TAB_LENGTH * WIDTH + 'px'; 
                setTimeout(function() {
                    $tabLi[TAB_LENGTH-1].style.left = '0';
                    $bannerTab.style.webkitTransition = 'none';
                    $bannerTab.style.webkitTransform = 'translateX('+(TAB_LENGTH-1)*(-WIDTH)+'px)';
                }, 400);

                index = TAB_LENGTH-1;
            }

            // for (var i = 0, len = $dotLi.length; i<len; i++) {
            //     _.removeClass($dotLi[i], 'active');
            // }
            _.removeClass($dotLi[previous], 'active');
            _.addClass($dotLi[index], 'active');
        },

        touch: function() {
            var that = this;
            var startLeft;
            var moveX;
            var setTimer = null;
            var fnStart = function(ev) {
                clearInterval(timer);
                clearTimeout(setTimer);
                var touch = ev.changedTouches[0];
                startLeft = touch.screenX;
            }

            var fnMove = function(ev) {
                var touch = ev.changedTouches[0];
                    moveX = touch.screenX - startLeft;
                var disX =  -index * WIDTH + moveX;

                if (disX < -(TAB_LENGTH - 1) * WIDTH ) {
                    $tabLi[0].style.left = TAB_LENGTH * WIDTH + 'px'; 
                } else if (disX > 0) {
                    $tabLi[TAB_LENGTH-1].style.left = - TAB_LENGTH * WIDTH + 'px'; 
                }

                $bannerTab.style.webkitTransform = 'translateX('+disX+'px)';
                $bannerTab.style.transform = 'translateX('+disX+'px)';
                $bannerTab.style.transition = 'none';
            }

            var fnEnd = function(ev) {

                var dir = Math.round(moveX / WIDTH);

                that.setPlay(dir);
                // 手势抬起， 重新开启自动播放
                setTimer = setTimeout(function() {
                    timer = setInterval(that.setPlay, 4000, -1);
                }, 400);
            }
            _.addEvent($bannerTab, 'touchstart', fnStart);
            _.addEvent($bannerTab, 'touchmove', fnMove);
            _.addEvent($bannerTab, 'touchend', fnEnd);
        }
    }
    module.exports = Tab;

    // exports.Tab = Tab;
});