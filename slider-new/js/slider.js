var carousel = (function () {
    // 默认参数
    var defaults = {
        mode: 'move',
        runTime: 800,
        intervalTime: 4000,
        mainListEl: '.carousel-main',
        paginationListEl: '.carousel-pagination',
        controller: '.carousel-controller',
        addTouchEvent: true,
        autoplay: true,
        mouseenterStop: true,
        minMove: 70
    };

    // 继承
    function _extend(subClass, superClass) {
        var F = function () {};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
    }

    // 父类
    var Carousel = function (el, options) {
        this.$el = $(el);
        this.current = 0;           // 初始选中第0项
        this.opts = options;
        this.$mainLists = this.$el.find(options.mainListEl) ? this.$el.find(options.mainListEl).children() : '';
        this.$paginationLists = this.$el.find(options.paginationListEl) ? this.$el.find(options.paginationListEl).children() : '';
        this.$controllers = this.$el.find(options.controller) ? this.$el.find(options.controller).children() : '';
        this.width = this.$mainLists.eq(0).outerWidth();
        this.max = this.$mainLists.length - 1;
    };

    // 初始化轮播dom
    Carousel.prototype.initialize = function () {
        throw new Error('子类需要重写此方法');
    };

    // 右边进入动画
    Carousel.prototype.toNext = function(num) {
        this.$mainLists.eq(num).css('left', this.width + 'px');
        this.$mainLists.eq(this.current).stop().animate({left: -this.width + 'px'}, this.opts.runTime, 'swing');
        this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
        return this.moveEedFn && this.moveEedFn();
    };

    // 左边进入动画
    Carousel.prototype.toPrev = function(num) {
        this.$mainLists.eq(num).css('left', -this.width + 'px');
        this.$mainLists.eq(this.current).stop().animate({left: this.width + 'px'}, this.opts.runTime, 'swing');
        this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
        return this.moveEedFn && this.moveEedFn();
    };

    // 动画实现1
    Carousel.prototype.changeFn = function(num) {
        if (num === this.current) {
            return;
        }
        if (num > this.current) {
            num = num > this.max ? 0 : num;
            this.toNext(num);
        } else {
            num = num < 0 ? this.max : num;
            this.toPrev(num);
        }
        this.current = num;
        this.$paginationLists && this.$paginationLists.eq(this.current).addClass('active').siblings().removeClass('active');
    };

    // 自动轮播
    Carousel.prototype.autoplay = function () {
        var _self = this;
        clearTimeout(this.times);
        this.times = setTimeout(function () {
            _self.changeFn(_self.current + 1);
        }, _self.opts.intervalTime)
    };

    // 移动端滑动事件
    Carousel.prototype.touchEvent = function(el, touchstartFn, touchendFn) {
        var _self = this,
            startX,
            startY;

        if (el[0]) {
            el[0].addEventListener('touchstart', function (ev) {
                startX = ev.touches[0].pageX;
                startY = ev.touches[0].pageY;
                touchstartFn ? touchstartFn() : '';
            });
            el[0].addEventListener('touchend', function (ev) {
                var endX, endY, direction;
                endX = ev.changedTouches[0].pageX;
                endY = ev.changedTouches[0].pageY;
                direction = getSlideDirection(startX, startY, endX, endY);
                touchendFn ? touchendFn(direction) : '';
            });
        }

        // 返回角度
        function getSlideAngle(dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        }

        // 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
        function getSlideDirection(startX, startY, endX, endY) {
            var dy = startY - endY;
            var dx = endX - startX;
            var result = 0;
            // 如果滑动距离太短
            if (Math.abs(dx) < _self.opts.minMove && Math.abs(dy) < _self.opts.minMove) {
                return result;
            }
            var angle = getSlideAngle(dx, dy);
            if (angle >= -45 && angle < 45) {
                result = 4;
            } else if (angle >= 45 && angle < 135) {
                result = 1;
            } else if (angle >= -135 && angle < -45) {
                result = 2;
            }
            else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3;
            }
            return result;
        }
    };

    // 绑定事件
    Carousel.prototype.bindEvent = function() {
        var _self = this;
        // 如果只有一张及以下轮播内容，直接返回
        if (this.max <= 0) {
            return;
        }
        // 是否自动轮播
        if (this.opts.autoplay) {
            this.autoplay();
            this.moveEedFn = this.autoplay;
        }
        // 鼠标经过动画暂停
        if (this.opts.mouseenterStop) {
            this.$el.on('mouseenter', this.opts.mainListEl + ',' + this.opts.paginationListEl + ',' + this.opts.controller, function () {
                clearTimeout(_self.times);
            });
            this.$el.on('mouseleave', this.opts.mainListEl + ',' + this.opts.paginationListEl + ',' + this.opts.controller, function () {
                if (_self.opts.autoplay) {
                    _self.autoplay();
                }
            });
        }
        this.$controllers.on('click', function (e) {
            e = e || window.event;
            $(e.target).index() === 0 ? _self.changeFn(_self.current - 1) : _self.changeFn(_self.current + 1);
        });
        //  序号控制点击事件
        this.$paginationLists.on('click', function () {
            _self.changeFn($(this).index());
        });
        // 移动端滑动支持
        if (this.opts.addTouchEvent) {
            // 滑动处理
            this.touchEvent(this.$el, touchstart, touchend);

            function touchstart() {
                clearTimeout(_self.times);
            }

            function touchend(direction) {
                touchMove(direction);
            }

            function touchMove(direction) {
                if (direction === 3) {
                    _self.changeFn(_self.current + 1);
                } else if (direction === 4) {
                    _self.changeFn(_self.current - 1);
                }
                if (_self.opts.autoplay) {
                    _self.autoplay();
                }
            }
        }
    };

    // 初始化一个轮播
    Carousel.prototype.init = function () {
        this.initialize();
        this.bindEvent();
    };



    // 移动模式
    var CarouselMove = function (el, options) {
        Carousel.call(this, el, options);
    };

    // 继承父类
    _extend(CarouselMove, Carousel);

    // 初始化轮播dom
    CarouselMove.prototype.initialize = function () {
        this.$mainLists.eq(this.current).css('left', '0px').siblings().css('left', -this.width + 'px');
    };

    // 右边进入动画
    CarouselMove.prototype.toNext = function(num) {
        this.$mainLists.eq(num).css('left', this.width + 'px');
        this.$mainLists.eq(this.current).stop().animate({left: -this.width + 'px'}, this.opts.runTime, 'swing');
        this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
        return this.moveEedFn && this.moveEedFn();
    };

    // 左边进入动画
    CarouselMove.prototype.toPrev = function(num) {
        this.$mainLists.eq(num).css('left', -this.width + 'px');
        this.$mainLists.eq(this.current).stop().animate({left: this.width + 'px'}, this.opts.runTime, 'swing');
        this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
        return this.moveEedFn && this.moveEedFn();
    };




    // 淡出淡入模式
    var CarouselFade = function (el, options) {
        Carousel.call(this, el, options);
    };

    // 继承父类
    _extend(CarouselFade, Carousel);

    // 初始化轮播dom
    CarouselFade.prototype.initialize = function () {
        this.$mainLists.eq(this.current).show().siblings().hide();
    };

    // 右边进入动画
    CarouselFade.prototype.toNext = function(num) {

        this.$mainLists.eq(num).stop().fadeIn(this.opts.runTime).siblings().fadeOut(this.opts.runTime);

        return this.moveEedFn && this.moveEedFn();
    };
    CarouselFade.prototype.toPrev = CarouselFade.prototype.toNext;



    // 初始化
    var init = function (el, options) {
        options = $.extend({}, defaults, options);
        if (options.mode === 'fade') {
            new CarouselFade(el, options).init();
        } else {
            new CarouselMove(el, options).init();
        }
    };

    return {
        init: init
    }
})();

