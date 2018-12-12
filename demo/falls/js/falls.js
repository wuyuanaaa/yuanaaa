var falls = (function () {
    /*
    * 1、获取页面宽度
    * 2、计算每行的图片张数，根据图片张数设置父容器宽度保证父容器居中
    * 3、依次生成子元素并且添加到父容器
    *       计算子元素的top 及 left
    * 4、添加父容器至 wrapper 容器
    * 5、绑定页面 resize 事件，进行重新布局
    * */
    var defaults = {
        width: 220,
        colSpace: 10,
        rowSpace: 10,
        itemClass: '_list-item' // 暴露的类名，方便修改边框等样式
    };

    var Falls = function (el, options) {
        this.el = document.querySelector(el);
        this.imgList = options.imgList;
        this.colSpace = options.colSpace;
        this.rowSpace = options.rowSpace;
        this.width = options.width;
        this.itemClass = options.itemClass;
        this.first = true;
        this.startIndex = 0;
        this.callback = [];
        this.loadAll = false;
    };

    var prototype = Falls.prototype;

    prototype.initialize = function () {
        var rootEl = document.createElement('div');

        rootEl.style.margin = '0 auto';
        rootEl.style.position = 'relative';

        this.rootEl = rootEl;
        this.el.appendChild(this.rootEl);
    };

    prototype.storageTop = function () {
        var topArr = [];
        for (var i = 0; i < this.col; i++) {
            topArr.push({
                left: this.colWidth * i,
                top: 0
            })
        }
        this.topArr = topArr;
    };

    prototype.addItem = function () {
        var _this = this,
            maxHeight = 0,
            topArr = this.topArr,
            imgList = this.imgList.slice(_this.startIndex),
            len = topArr.length;

        (function addImg() {
            var current = imgList.shift(),
                top = topArr[0].top,
                index = 0;
            for (var j = 1; j < len; j++) { // 遍历求出当前最小 top 值，及对应的列数 index
                if (topArr[j].top < top) {
                    top = topArr[j].top;
                    index = j;
                }
            }

            var item = document.createElement('div');   // 创建图片包裹元素
            item.style.position = 'absolute';
            item.style.top = top + 'px';
            item.style.left = topArr[index].left + 'px';
            item.style.width = _this.width + 'px';
            item.style.boxSizing = 'border-box';
            item.classList.add(_this.itemClass);

            var img = document.createElement('img');    // 创建图片元素
            img.style.width = '100%';
            img.src = current.src;
            img.alt = current.alt;

            item.appendChild(img);
            _this.rootEl.appendChild(item);

            img.onload = function () {
                topArr[index].top += item.offsetHeight + _this.rowSpace;  // 新增图片后更新高度数组
                maxHeight = maxHeight < topArr[index].top ? topArr[index].top : maxHeight;
                _this.rootEl.style.height = maxHeight + 'px';   // 更新容器的高度

                if (imgList.length) {
                    addImg();
                } else {
                    _this.startIndex = _this.imgList.length;
                    if (!_this.callback.length) {
                        _this.loadAll = true;
                    } else {
                        _this.callback.shift()();
                    }
                }
            };
        })();
    };

    prototype.loadFalls = function () {
        var wrapWidth = this.el.clientWidth;    // 获取容器的宽度
        this.colWidth = this.width + this.colSpace;     // 单个图片加上列间隙需要的宽度
        this.col = Math.floor((wrapWidth + this.colSpace) / this.colWidth); // 获取图片列数
        this.rootEl.style.width = this.col * this.colWidth - this.colSpace + 'px';  // 根元素的宽度

        if (this.first) {   // 如果初次渲染，直接执行
            this.storageTop();
            this.addItem();
            this.first = false;
            this.lastCol = this.col;
        } else {    // 非初次渲染，判断列数是否变化
            if (this.lastCol !== this.col) {
                this.startIndex = 0;    // 列数变化时，全部重新渲染
                this.rootEl.innerHTML = '';     // 清空根元素
                this.storageTop();
                this.addItem();
                this.lastCol = this.col;
            }
        }
    };

    prototype.bindEvent = function () {     // 通过 resize 事件监听容器宽度变化
        window.addEventListener('resize', this.loadFalls.bind(this));
    };

    prototype.init = function () {  //  生成一个瀑布流实例
        this.initialize();
        this.loadFalls();
        this.bindEvent();
        return this;    // 返回实例对象
    };

    prototype.addImgReload = function (arr) {
        var _this = this;
        if (this.loadAll) {
            this.imgList = arr;
            this.addItem();
        } else {
            this.callback.push(function () {
                _this.imgList = arr;
                _this.addItem();
            })
        }
    };

    function extend(target, varArgs) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    }

    const init = function (el, options) {
        options = extend([], defaults, options);
        return new Falls(el, options).init();
    };


    return {
        init: init
    }
})();
