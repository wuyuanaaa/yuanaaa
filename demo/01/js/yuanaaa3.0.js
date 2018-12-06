(function () {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this ||
        {};
    var $_y = {};
    root.$_y = $_y;
    $_y.VERSION = '3.0';
    /* 轮播 */
    $_y.carousel = (function () {
        // 默认参数
        var defaults = {
            mode: 'move',
            runTime: 800,
            intervalTime: 4000,
            mainListEl: '.carousel-main',
            paginationListEl: '.carousel-pagination',
            controller: '.carousel-controller',
            addTouchEvent: false,
            autoplay: true,
            mouseenterStop: false,
            minMove: 70
        };

        // 继承
        function _extend(subClass, superClass) {
            var F = function () {
            };
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
        Carousel.prototype.toNext = function (num) {
            this.$mainLists.eq(num).css('left', this.width + 'px');
            this.$mainLists.eq(this.current).stop().animate({left: -this.width + 'px'}, this.opts.runTime, 'swing');
            this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
            return this.moveEedFn && this.moveEedFn();
        };

        // 左边进入动画
        Carousel.prototype.toPrev = function (num) {
            this.$mainLists.eq(num).css('left', -this.width + 'px');
            this.$mainLists.eq(this.current).stop().animate({left: this.width + 'px'}, this.opts.runTime, 'swing');
            this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
            return this.moveEedFn && this.moveEedFn();
        };

        // 动画实现1
        Carousel.prototype.changeFn = function (num) {
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
        Carousel.prototype.touchEvent = function (el, touchstartFn, touchendFn) {
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
        Carousel.prototype.bindEvent = function () {
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
        CarouselMove.prototype.toNext = function (num) {
            this.$mainLists.eq(num).css('left', this.width + 'px');
            this.$mainLists.eq(this.current).stop().animate({left: -this.width + 'px'}, this.opts.runTime, 'swing');
            this.$mainLists.eq(num).stop().animate({left: '0px'}, this.opts.runTime, 'swing');
            return this.moveEedFn && this.moveEedFn();
        };

        // 左边进入动画
        CarouselMove.prototype.toPrev = function (num) {
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
        CarouselFade.prototype.toNext = function (num) {

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
    /* 手机号码获客 */
    $_y.saveActivitySmsInfo = (function () {
        // 默认参数
        var defaults = {
            countdown: 90,
            els: {
                cellPhone: '.phone-number',
                codeValue: '.code-value',
                sendCode: '.send-code',
                submitButton: '.submit-button'
            },
            popUp: {
                popUpEl: '.layer-warp',
                popUpCloseEl: '.layer-close'
            },
            needMsg: true
        };

        // 继承
        function _extend(subClass, superClass) {
            var F = function () {
            };
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass;
        }

        // 父类
        var SaveActivitySmsInfo = function (el, options) {
            this.$el = $(el);
            this.opts = options;
            this.countdown = options.countdown;
            this.$cellPhone = $(options.els.cellPhone);
            this.$codeValue = $(options.els.codeValue);
            this.$sendCode = $(options.els.sendCode);
            this.sendCodeClass = options.els.sendCode;
            this.$submitButton = $(options.els.submitButton);
            this.$popUpEl = $(options.popUp.popUpEl);
            this.$popUpCloseEl = $(options.popUp.popUpCloseEl);
            this.platform = 'yk';
            this.getInfo = options.getInfo;
            this.callback = options.callback;
            this.sceneCode = options.sceneCode;
        };

        // 确定主机号
        SaveActivitySmsInfo.prototype.getHost = function () {
            var protocol = window.location.protocol;
            this.host = protocol === 'http:' ? 'http://tf.topksw.com' : 'https://m.ykclass.com';
        };
        // 设置短信倒计时
        SaveActivitySmsInfo.prototype.setTime = function (el) {
            var countdown = this.countdown,
                initialVal = el.val();          // 储存初始文字
            el.attr("disabled", true);

            function fn() {
                countdown--;
                el.val("重新发送(" + countdown + ")");
                if (countdown >= 0) {
                    setTimeout(fn, 1000);
                } else {
                    el.removeAttr("disabled");
                    el.val(initialVal);
                    countdown = 60;
                }
            }

            setTimeout(fn, 1000);
        };
        // 手机号码验证
        SaveActivitySmsInfo.prototype.testPhoneNumber = function (num) {
            var regPhone = /^1[34578][0-9]{9}$/;
            if (!num) {
                layer.msg('请输入手机号码！');
                return false;
            }
            if (num.length > 11) {
                layer.msg('手机号超出字符限制！');
                return false;
            }
            if (!regPhone.test(num)) {
                layer.msg('手机号码输入有误！');
                return false
            }
            return true;
        };
        // ajax
        SaveActivitySmsInfo.prototype.ajax = function (url, data, callback) {
            console.log(data);
            $.ajax({
                type: "get",
                url: url,
                dataType: "jsonp",
                jsonp: "callback", //jsonp回调函数名的参数名
                data: data,
                success: function (data) {
                    if (callback && typeof callback === 'function') {
                        callback(data);
                    }
                }
            })
        };
        // 基础事件绑定
        SaveActivitySmsInfo.prototype.bindBase = function () {
            var _self = this;
            _self.$cellPhone.keyup(function () {
                _self.phoneNumber = $(this).val();
                if (_self.phoneNumber.length > 11) {
                    layer.msg('手机号超出字符限制！')
                }
            });
            if (_self.popUp) {
                _self.$popUpCloseEl.on('click', function () {
                    _self.$popUpEl.hide();
                })
            }
        };
        // 其他事件绑定
        SaveActivitySmsInfo.prototype.bindMore = function () {
            throw new Error('此方法需重写');
        };
        // 初始化一个短信验证
        SaveActivitySmsInfo.prototype.init = function () {
            this.getHost();
            this.bindBase();
            this.bindMore();
        };


        // 需要短信验证模式
        var NeedMsg = function (el, options) {
            SaveActivitySmsInfo.call(this, el, options);
        };
        // 继承父类
        _extend(NeedMsg, SaveActivitySmsInfo);
        // 发送验证码
        NeedMsg.prototype.sendSms = function () {
            console.log(this);
            if (!this.testPhoneNumber(this.phoneNumber)) {
                return;
            }
            this.setTime(this.$sendCode);
            var url = this.host + "/common/sendSmsMessage.html",
                data = {
                    phone: this.phoneNumber,
                    platform: this.platform
                };
            this.ajax(url, data, function (msg) {
                if (msg.c === '100') {
                    layer.msg('短信发送成功！');
                }
            });
        };
        // 验证验证码
        NeedMsg.prototype.testCode = function (code) {
            var regCode = /[0-9]{6}/;
            if (!code) {
                layer.msg('请输入验证码！');
                return false;
            }
            if (!regCode.test(code)) {
                layer.msg('验证码格式错误，应该为6位数字！');
                return false;
            }
            return true;
        };
        // 提交信息
        NeedMsg.prototype.submit = function (object, code, callback) {
            object.accessUrl = window.location.href;
            object.code = code;
            console.log(this.testCode(code));
            if (!this.testPhoneNumber(object.phone) || !this.testCode(code)) {
                return;
            }
            var url = this.host + "/common/saveActivitySmsInfo.html";
            this.ajax(url, object, callback);
        };
        // 验证码回调
        SaveActivitySmsInfo.prototype.msgCallback = function (msg) {
            if (msg.c === '100') {
                if (this.$popUpEl.length) {
                    this.$popUpEl.show();
                }
                $el.find('input').not(this.sendCodeClass).val("");
                if (this.callback && typeof this.callback === 'function') {    // 执行回调函数
                    this.callback();
                }
            } else if (msg.m == '用户手机号不能为空') {
                layer.msg('手机号码不能为空');
            } else if (msg.m == '短信验证码不能为空!') {
                layer.msg('短信验证码不能为空!');
            } else if (msg.code === 202) {
                layer.msg('短信验证码错误!');
            } else {
                layer.msg('短信验证码错误!');
            }
        };
        // 事件绑定
        NeedMsg.prototype.bindMore = function () {
            var _self = this;

            this.$sendCode.on('click', function () {
                _self.sendSms.call(_self);
            });

            this.$submitButton.on('click', function () {
                var infoMsg = '';
                if (_self.getInfo && typeof _self.getInfo === 'function') {
                    infoMsg = _self.getInfo();
                }
                var obj = {
                    sceneCode: _self.sceneCode,
                    phone: _self.phoneNumber,
                    content: infoMsg
                };
                var code = _self.$codeValue.val();
                _self.submit(obj, code, function (msg) {
                    _self.msgCallback.call(_self, msg);
                });
            });
        };


        // 无短信验证模式
        var NoMsg = function (el, options) {
            SaveActivitySmsInfo.call(this, el, options);
        };
        // 继承父类
        _extend(NoMsg, SaveActivitySmsInfo);
        // 提交信息
        NoMsg.prototype.submit = function (object) {
            object.accessUrl = window.location.href;
            if (!this.testPhoneNumber(object.phone)) {
                return;
            }
            var url = this.host + "/common/saveActivityInfo.html";
            this.ajax(url, object);
        };
        // 事件绑定
        NoMsg.prototype.bindMore = function () {
            var _self = this;

            this.$submitButton.on('click', function () {
                var infoMsg = '';
                if (_self.getInfo && typeof _self.getInfo === 'function') {
                    infoMsg = _self.getInfo();
                }
                var obj = {
                    sendCode: _self.sendCode,
                    phone: _self.phoneNumber,
                    content: infoMsg
                };

                _self.submit(obj);
            });
        };


        // 实例保存
        var o = [];

        // 初始化
        var init = function (el, options) {
            options = $.extend({}, defaults, options);
            if (options.needMsg) {
                var msg = new NeedMsg(el, options);
                msg.init();
                o.push({
                    el: el,
                    msg: msg
                })
            } else {
                new NoMsg(el, options).init();
            }
        };
        // 改变场景代码
        var changeSceneCode = function (el, code) {
            var hasChange = false;
            for (var i = 0, len = o.length; i < len; i++) {
                if (o[i].el === el) {
                    o[i].msg.sceneCode = code;
                    hasChange = true;
                }
            }
            !hasChange && console.warn('尝试改变未注册 saveActivitySmsInfo 组件的场景代码！');
        };

        return {
            init: init,
            changeSceneCode: changeSceneCode
        }
    })();
    /* 滚屏导航 */
    $_y.scrollPage = (function () {
        // 默认参数
        var defaults = {
            navEl: '.md',
            count: 100,
            listActiveClass: 'active',
            animateTime: 600
        };

        var MutationObserver = root.MutationObserver || root.WebkitMutationObserver || root.MozMutationObserver;

        // 构造函数
        var ScrollPage = function (el, options) {
            this.$el = $(el);
            this.$navEl = $(options.navEl);
            this.count = options.count;
            this.$list = this.$navEl.find('li');
            this.listActiveClass = options.listActiveClass;
            this.animateTime = options.animateTime;
            this.throttleTime = 200;
        };


        // 存储高度
        ScrollPage.prototype.storeHeight = function () {
            var $el = this.$el;
            this.heightArr = [];
            for (var i = 0, len = $el.length; i < len; i++) {
                this.heightArr.push($el.eq(i).offset().top);
            }
        };
        // 滚动事件
        ScrollPage.prototype.scrollFn = function () {
            var top = $(document).scrollTop();
            var arr = this.heightArr;
            var j = arr.length - 1;
            var active = this.listActiveClass;
            var _self = this;

            (function findMax() {
                if (top + _self.count > arr[j]) {
                    _self.$list.removeClass(active).eq(j).addClass(active)
                } else {
                    j--;
                    if (j >= 0) {
                        arguments.callee();
                    }
                }
            })();

        };
        // 节流
        ScrollPage.prototype.throttle = function (func, wait) {
            var timeout, context, args;
            return function () {
                context = this;
                args = arguments;
                if (!timeout) {
                    timeout = setTimeout(function () {
                        timeout = null;
                        func.apply(context, args);
                    }, wait)
                }
            }
        };
        // 点击事件
        ScrollPage.prototype.handleClick = function (context) {
            var i = $(this).index(),
                h = context.heightArr[i];
            if (i > context.heightArr.length - 1) {  // 序号并没有对应dom元素，直接返回
                return;
            }
            $('body,html').stop().animate({
                scrollTop: h - context.count + 2    // 此处+2只为导航的active及时切换
            }, context.animateTime)
        };

        // 事件绑定
        ScrollPage.prototype.bindEvent = function () {
            var _self = this;
            // 滚动事件绑定
            $(document).on('scroll', _self.throttle(function () {
                _self.scrollFn.call(_self);
            }, _self.throttleTime));
            // list点击事件
            _self.$navEl.on('click', 'li', function (e) {
                e = e || window.event;
                _self.handleClick.call(e.target, _self);
            });
            // 文档高度变化是重新计算各锚点高度
            var observer = new MutationObserver(function () {
                _self.storeHeight();
            });
            observer.observe(document.documentElement, {
                attributes: true
            })
        };

        // 初始化
        ScrollPage.prototype.init = function () {
            this.$list.eq(0).addClass(this.listActiveClass);
            this.storeHeight();
            this.bindEvent();
        };

        // 实例保存
        var o = [];

        // 初始化
        var init = function (el, options) {
            options = $.extend({}, defaults, options);
            for (var i = 0, len = o.length; i < len; i++) {
                if (o[i].el === el) {
                    console.warn('重复初始化类名为' + el + '的scrollPage');
                    return;
                }
            }
            var msg = new ScrollPage(el, options);
            msg.init();
            o.push({
                el: el,
                msg: msg
            })
        };

        // 更新高度钩子
         var reset = function (el) {
             for (var i = 0, len = o.length; i < len; i++) {
                 if (o[i].el === el) {
                     o[i].msg.storeHeight();
                     return;
                 }
             }
             console.warn('scrollPage.reset 未找到' + el + '类名注册的组件');
         };

        return {
            init: init,
            reset: reset
        }
    })();
    /* 入屏动画 */
    $_y.animationIn = (function () {
        // 默认参数
        var defaults = {
            el: '.anima',
            scale: 0.8,
            throttleTime: 200
        };

        // 构造函数
        var AnimationIn = function (options) {
            this.$el = $(options.el);
            this.throttleTime = options.throttleTime;
            this.scale = options.scale;
            this.first = true;
        };

        // 存储高度
        AnimationIn.prototype.storeHeight = function () {
            var $el = this.$el;
            this.heightArr = [];
            for (var i = 0, len = $el.length; i < len; i++) {
                // 保存元素相对页面的高度；如果元素有相对元素，则取相对元素相对页面的高度
                $el.eq(i).data('relative') ? this.heightArr.push($($el.eq(i).data('relative')).offset().top) : this.heightArr.push($el.eq(i).offset().top);
            }
            if(this.first) {            // 首次进入页面触发一次，
                this.scrollFn();
                this.first = false;
            }
        };
        // 滚动事件
        AnimationIn.prototype.scrollFn = function () {
            var top = $(document).scrollTop();
            var arr = this.heightArr;
            var j = 0;
            var count = $(window).innerHeight() * this.scale;
            var $el = this.$el;
            var _self = this;
            (function findReady() {
                if (!$el.eq(j).data('hasDone') && top + count > arr[j]) {
                    _self.readyToAnimation($el.eq(j));
                }
                j++;
                if (j < arr.length) {
                    arguments.callee();
                }
            })();
        };
        // 单个元素动画判断
        AnimationIn.prototype.readyToAnimation = function ($singleEl) {
            $singleEl.data('hasDone', true);        // 进行标注，防止重复动画
            var delay,
                _self = this;
            if ($singleEl.data('delay') && (delay = parseInt(el.data('delay')))) {
                setTimeout(function () {
                    _self.animation($singleEl);
                }, delay)
            }
            else {
                _self.animation($singleEl);
            }
        };
        // 单个元素动画
        AnimationIn.prototype.animation = function ($singleEl) {
            $singleEl.data('addlibrary') ? $singleEl.addClass($singleEl.data('addlibrary')) : '';
            $singleEl.css({
                'opacity': 1
            }).addClass($singleEl.data('animatetype'));
            ($singleEl.data('remove') !== false) && this.removeClass($singleEl);    // 除非标注不移除，默认移除类名
        };
        // 移除添加的类名
        AnimationIn.prototype.removeClass = function ($singleEl) {
            setTimeout(function () {
                $singleEl.data('addlibrary') ? $singleEl.removeClass($singleEl.data('addlibrary')) : '';
                $singleEl.removeClass($singleEl.data('animatetype'));
            }, 1000)    // 1秒后动画执行完成，移除类名
        };

        // 节流
        AnimationIn.prototype.throttle = function (func, wait) {
            var timeout, context, args;
            return function () {
                context = this;
                args = arguments;
                if (!timeout) {
                    timeout = setTimeout(function () {
                        timeout = null;
                        func.apply(context, args);
                    }, wait)
                }
            }
        };


        // 事件绑定
        AnimationIn.prototype.bindEvent = function () {
            var _self = this;
            // 滚动事件绑定
            $(document).on('scroll', _self.throttle(function () {
                _self.scrollFn.call(_self);
            }, _self.throttleTime));
        };

        // 初始化
        AnimationIn.prototype.init = function () {
            this.$el.css({'opacity': 0});
            this.storeHeight();
            this.bindEvent();
        };

        // 实例保存
        var o = [];

        // 初始化
        var init = function (options) {
            options = $.extend({}, defaults, options);
            for (var i = 0, len = o.length; i < len; i++) {
                if (o[i].el === options.el) {
                    console.warn('重复初始化类名为' + options.el + '的animationIn');
                    return;
                }
            }
            var msg = new AnimationIn(options);
            msg.init();
            o.push({
                el: options.el,
                msg: msg
            })
        };

        return {
            init: init
        }
    })();
    /* 鼠标滑动事件 */
    $_y.touchEvent = function (obj) {
        var defaultOptions = {
                el: '',
                touchstartFn: null,
                touchendFn: null,
                minMove: 70
            },
            options = $.extend(defaultOptions, obj || {}),
            startX,
            startY,
            el = options.el;

        if (el) {
            el.addEventListener('touchstart', function (ev) {
                startX = ev.touches[0].pageX;
                startY = ev.touches[0].pageY;
                options.touchstartFn ? options.touchstartFn() : '';
            });
            el.addEventListener('touchend', function (ev) {
                var endX, endY, direction;
                endX = ev.changedTouches[0].pageX;
                endY = ev.changedTouches[0].pageY;
                direction = getSlideDirection(startX, startY, endX, endY);
                options.touchendFn ? options.touchendFn(direction) : '';
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
            if (Math.abs(dx) < options.minMove && Math.abs(dy) < options.minMove) {
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
    /* 页面动画至指定元素 */
    $_y.scrollTo = function (el) {
        var h = $(el).offset().top - 200;
        $('html,body').animate({'scrollTop': h + 'px'}, 500);
    };
    /* 元素指定位置展示 */
    $_y.fixedTop = (function () {
        var defaults = {
            top: 0,
            zIndex: 888,
            throttleTime: 32
        };

        var Fixed = function (el, options) {
            this.$el = $(el);
            this.$target = $(options.target);
            this.top = options.top;
            this.zIndex = options.zIndex;
            this.hasFixed = false;
            this.throttleTime = options.throttleTime;
            this.show = true;
        };

        var proto = Fixed.prototype;
        /**
         * 初始化并获取 dom 的数据，包含：
         * 1、初始z-index
         * 2、this.height :导航距自身高度
         * 3、this.offsetTop :导航距顶部高度
         * 4、this.nextinner :占位元素内元素
         * 5、this.nextOffsetTop :相邻元素距顶部高度
         * 6、this.bottom 如果有参照 参照 dom 的底部距页面顶部高度
         * */
        proto.storageAttr = function () {
            this.initialZIndex = this.$el.css('z-index');       // 1
            this.height = parseInt(this.$el[0].getBoundingClientRect().height);  // 2
            this.offsetTop = this.$el.offset().top;    // 3
            // 导航条后面添加占位元素 并为外层添加 BFC，防止 margin 折叠或者穿透
            this.$el.after('<div id="fixedTop-placeholder" style="overflow: hidden"><div id="fixedTop-placeholder-inner"></div></div>');

            this.nextinner = $('#fixedTop-placeholder-inner');  // 4

            this.nextOffsetTop = this.nextinner.offset().top;  // 5

            if (this.$target.length) {  // 6
                this.bottom = this.$target[0].getBoundingClientRect().height + this.$target.offset().top;
            }
        };
        // 添加 fixed 属性
        proto.addFixed = function () {
            this.$el.css({
                'position': 'fixed',
                'top': this.top,
                'z-index': this.zIndex
            });

            var next = this.nextinner,
                nextOffsetTop = next.offset().top;

            next.css({'marginTop': this.nextOffsetTop - nextOffsetTop + 'px'});
            this.hasFixed = true;
        };
        // 移除 fixed 属性
        proto.moveFixed = function () {
            this.$el.css({
                'position': 'relative',
                'top': 0,
                'z-index': this.initialZIndex
            });
            if (this.nextinner !== undefined) {
                this.nextinner.css({'marginTop': 0});
            }
            this.hasFixed = false;
        };
        // 页面滚动事件函数
        proto.scrollFn = function () {
            if(this.bottom) {       // 判断是否有参照 dom，如果有，到达参照 dom 底部时导航隐藏
                this.scrollFn = function () {      // 惰性函数进行重新赋值，防止重复判断
                    var top = $(document).scrollTop();
                    if (!this.hasFixed && (top + this.top) > this.offsetTop) {
                        this.addFixed();
                    }

                    if (this.hasFixed) {
                        if ((top + this.top) < this.offsetTop) {
                            this.moveFixed();
                        }
                        if ((top + this.top + this.height) > this.bottom) {
                            if (this.show) {
                                this.show = false;
                                this.$el.hide();
                            }
                        } else {
                            if (!this.show) {
                                this.show = true;
                                this.$el.show();
                            }
                        }
                    }
                }
            } else  {
                this.scrollFn = function () {
                    var top = $(document).scrollTop();

                    if (!this.hasFixed && (top + this.top) > this.offsetTop) {
                        this.addFixed();
                    }

                    if (this.hasFixed && (top + this.top) < this.offsetTop) {
                        this.moveFixed();
                    }
                }
            }
        };

        proto.throttle = function (func, wait) {
            var timeout, context, args;
            return function () {
                context = this;
                args = arguments;
                if (!timeout) {
                    timeout = setTimeout(function () {
                        timeout = null;
                        func.apply(context, args);
                    }, wait)
                }
            }
        };

        proto.bindEvent = function () {
            var _self = this;
            _self.scrollFn();
            $(document).on('scroll', _self.throttle(_self.scrollFn.bind(_self),_self.throttleTime))
        };

        proto.init = function () {
            this.storageAttr();
            this.bindEvent();
        };

        var init = function (el, options) {
            options = $.extend({}, defaults, options);
            new Fixed(el, options).init();
        };

        return {
            init: init
        }
    })();
    /* 禁止input number滚轮事件 */
    $_y.preventMouseWheel = function () {
        var $nums = $('input[type = "number"]');
        for (var i = 0, len = $nums.length; i < len; i++) {
            $nums[i].onmousewheel = function () {
                return false;
            };
            $nums[i].addEventListener('DOMMouseScroll', function (e) {
                e = e || window.event;
                e.preventDefault();
            }, false)
        }
    };
    /* 普通页面自动公司名称备案号 */
    $_y.registered = function () {
        var domainName = window.location.host,
            $registeredName = $('#registeredName'),
            $registeredNum = $('#registeredNum'),
            $certificate = $('#certificate');
        for (var i = 0, len = this.corporationList.length; i < len; i++) {
            if (domainName.indexOf(this.corporationList[i].dName) > -1) {
                $registeredName.text(this.corporationList[i].name);
                $registeredNum.text(this.corporationList[i].num);
                if (!this.corporationList[i].hasCertificate) {
                    $certificate.html('');
                }
            }
        }
    };
    /* 百度单页自动公司名称备案号 */
    $_y.registeredBd = function () {
        var domainName = window.location.host,
            $footer = $('.footer');
        for (var i = 0, len = this.corporationList.length; i < len; i++) {
            if (domainName.indexOf(this.corporationList[i].dName) > -1) {
                $footer.html('<p>Copyright © 2018 ' + this.corporationList[i].name + ' All Rights Reserved <br>' + this.corporationList[i].num + '</p>')
            }
        }
    };
    /* 审核页面自动公司名称备案号 */
    $_y.registeredSh = function () {
        var domainName = window.location.host,
            $footer = $('.footer');
        for (var i = 0, len = this.corporationList.length; i < len; i++) {
            if (domainName.indexOf(this.corporationList[i].dName) > -1) {
                $footer.html(this.corporationList[i].name)
            }
        }
    };
    /* 改变微信 */
    $_y.changeWeChat = function (arr, el) {
        var $code = el ? $(el) : $('.code'),
            // wxNum = arr[Math.floor(Math.random() * arr.length)]; // 随机取一个微信号
            wxNum = arr[+new Date() % arr.length];      // 18.11.15 更新随机方式
        if ($code.length < 0) {
            console.warn("'changeWeChat'方法指向的dom为空！");
            return;
        }
        $code.attr("data-clipboard-text", wxNum);
        $code.text(wxNum);
    };
    /* 复制微信 */
    $_y.copyWeChat = function (arr, options) {
        var wxNow = arr[+new Date() % arr.length];      // 18.11.15 更新随机方式
        noLayer = options.noLayer ? options.noLayer : '.wxnumber',
            openLayer = options.openLayer ? options.openLayer : '.wxCode',
            $xnkf = options.el ? $(options.el) : ($('.ntkf').length > 0 ? $('.ntkf') : $('.xnkf')); // 确定页面小能类名

        $(noLayer).text(wxNow);
        $(openLayer).text(wxNow);
        $xnkf.on('click', openLayerFn);
        clipboardFn(openLayer, openLayerFn);
        clipboardFn(noLayer);

        function clipboardFn(classNameString, callback) {
            var clipboard = new Clipboard(classNameString),
                $obj = $(classNameString);
            $obj.on('click', function () {
                $obj.attr('data-clipboard-text', wxNow);
            });
            clipboard.on('success', function () {
                layer.msg('复制成功')
            });
            clipboard.on('error', function () {
                if (callback) {
                    callback();
                }
                layer.msg('当前浏览器不支持点击复制，请长按复制')
            });
        }

        function openLayerFn() {
            layer.open({
                type: 1,
                title: false,
                content: $('.w_2'),
                area: ['7.6rem', '8rem'],
                closeBtn: 0,
                shadeClose: true,
                shade: [0.7, '#000'],
                anim: 2
            })
        }
    };
    /* 公共数据 */
    $_y.corporationList = [
        {
            "id": 0,
            "dName": "ytxedu",
            "name": "湖北云天下教育科技有限公司",
            "num": "鄂ICP备12016896号-8",
            "hasCertificate": true
        }, {
            "id": 1,
            "dName": "ykclass",
            "name": "湖北云天下教育科技有限公司",
            "num": "鄂ICP备12016896号-7",
            "hasCertificate": true
        }, {
            "id": 2,
            "dName": "guopass",
            "name": "武汉智慧环球科技有限公司",
            "num": "鄂ICP备16004339号-3",
            "hasCertificate": false
        }, {
            "id": 3,
            "dName": "topksw",
            "name": "武汉乐教科技有限公司",
            "num": "鄂ICP备13016533号",
            "hasCertificate": false
        }, {
            "id": 4,
            "dName": "yythb",
            "name": "北京文博华茂科技有限公司",
            "num": "京ICP备16065121号-1",
            "hasCertificate": false
        }, {
            "id": 5,
            "dName": "peisway",
            "name": "深圳市佩思维科技有限公司",
            "num": "粤ICP备15038492号-1",
            "hasCertificate": false
        }, {
            "id": 6,
            "dName": "hzhmcy",
            "name": "惠州市宏茂网络科技有限公司",
            "num": "粤ICP备17014673号-1",
            "hasCertificate": false
        }, {
            "id": 7,
            "dName": "cub100",
            "name": "惠州优车宝网络科技有限公司",
            "num": "粤ICP备15101985号-1",
            "hasCertificate": false
        }, {
            "id": 8,
            "dName": "ztkao",
            "name": "武汉智慧环球教育科技有限公司",
            "num": "鄂ICP备16004339号",
            "hasCertificate": false
        }, {
            "id": 9,
            "dName": "qcwedu",
            "name": "北京千才汇教科技有限公司",
            "num": "京ICP备16020172号-2",
            "hasCertificate": false
        }, {
            "id": 10,
            "dName": "yyt",
            "name": "北京文博华茂科技有限公司",
            "num": "京ICP备16065121号-1",
            "hasCertificate": false
        }, {
            "id": 11,
            "dName": "591book",
            "name": "武汉书香门第教育科技有限公司",
            "num": "鄂ICP备18009206号-1",
            "hasCertificate": false
        }, {
            "id": 12,
            "dName": "kangerwang",
            "name": "合肥盘手金融教育培训有限公司",
            "num": " ",
            "hasCertificate": false
        }, {
            "id": 13,
            "dName": "ytkj",
            "name": "长沙市亿泰科技有限公司",
            "num": "湘ICP备17018323号-3",
            "hasCertificate": false
        }, {
            "id": 14,
            "dName": "guanying",
            "name": "湖南冠赢网络科技有限公司",
            "num": "湘ICP备18000413号-1",
            "hasCertificate": false
        }, {
            "id": 15,
            "dName": "qikuangwl",
            "name": "大连安家帮网络科技有限公司",
            "num": "粤ICP备17069813号-3",
            "hasCertificate": false
        }, {
            "id": 16,
            "dName": "qim168",
            "name": "长沙起锚百货贸易有限责任公司",
            "num": "湘ICP备18010362号-1",
            "hasCertificate": false
        }, {
            "id": 17,
            "dName": "lexue",
            "name": "北京千才汇教科技有限公司",
            "num": "京ICP备16020172号-1",
            "hasCertificate": false
        }, {
            "id": 18,
            "dName": "qiancai",
            "name": "北京千才汇教科技有限公司",
            "num": "京ICP备16020172号-2",
            "hasCertificate": false
        }, {
            "id": 19,
            "dName": "bdzhuoyuewl",
            "name": "武汉卓越未来科技有限公司",
            "num": "鄂ICP备17025091号-1",
            "hasCertificate": false
        }, {
            "id": 20,
            "dName": "ykb120",
            "name": "湖北云天下教育科技有限公司",
            "num": "鄂ICP备12016896号-8",
            "hasCertificate": true
        }, {
            "id": 21,
            "dName": "ytx123",
            "name": "湖北云天下教育科技有限公司",
            "num": "鄂ICP备12016896号-8",
            "hasCertificate": true
        }, {
            "id": 22,
            "dName": "cylaikj",
            "name": "成都成昱莱科技有限公司",
            "num": "蜀ICP备18022312号-3",
            "hasCertificate": false
        }
    ];
})();

