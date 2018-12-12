# 原生 js 实现面对对象版瀑布流

## 一、一些闲话

> 作为一个写静态的切图仔，其实日常工作中根本用不上瀑布流这种小清新，毕竟营销页面的需求都是__抢眼__、__吸睛__、__高大上__好不好，昨上午闲着没事看到别人写的瀑布流的帖子，觉得很好玩的样子，然后决定上午就写一个试试。。。所以，今天下午，就来整理下这过程中的一些思路。

## 二、需求整理及最终效果

写代码之前大概列了一下需求，然后中间又加上了一些其他功能，最终的需求如下：

### 2.1 需求列表

- 1、希望是用原生 js 代码，jq 写多了怕忘了原生；
- 2、面对对象方式封装，根据图片数据渲染页面；
- 3、瀑布流部分可以添加至任意容器元素内，毕竟页面还会有其他内容；
- 4、图片宽度，行列间距可定义；
- 5、图片外容器可以自定义边框、阴影等属性；
- 6、图片数据增加后可以调用方法渲染新增部分，原始部分保存不变；

### 2.2 最终效果

[完整代码](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/falls)
[页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/falls/index.html)

- 3秒后新增3张图片

## 三、代码实现

### 3.1 基础框架

> 起一个自执行函数，只需要暴露一个 falls 变量，该变量指向一个包含 init 方法的对象；
init 方法有2个参数：
    - el：瀑布流的容器的选择符
    - options：其他参数
ps: 这里还用到了一个自定义的 extend 方法，用于合并默认属性以及自定义属性对象，怕被说兼容性不好就没有用 ES6 语法，参照 Object.assign 方法，完整代码里也有，此处不多介绍；

```
var falls = (function () {
    var defaults = {

    };

    var Falls = function (el, options) {

    };

    var prototype = Falls.prototype;

    var init = function (el, options) {
        options = extend([], defaults, options);
        return new Falls(el, options).init();
    };

    return {
        init: init
    }
})();
```

### 3.2 基础属性

> 接下来确定一些可以定义的属性：
    - width: 图片（图片外容器）的宽度
    - colSpace: 列间距
    - rowSpace: 行间距
    - itemClass: 图片外容器类名，方便修改边框、阴影等样式
根据这些属性，随手确定了各项默认值

```
var defaults = {
    width: 220,
    colSpace: 10,
    rowSpace: 10,
    itemClass: '_list-item'
};
```

### 3.3 构造函数

> 定义 Falls 构造函数，最终该构造函数有以下初始属性（属性在后面用到再做解释）：

```
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
```

### 3.4 添加原型方法

> 在添加原型方法之前：
```
var prototype = Falls.prototype;
```
这样可以少写好多字母呢，真棒！！！

#### 3.4.1 初始化 initialize 方法

```
prototype.initialize = function () {
    var rootEl = document.createElement('div');

    rootEl.style.margin = '0 auto';
    rootEl.style.position = 'relative';

    this.rootEl = rootEl;
    this.el.appendChild(this.rootEl);
};
```

这里定义了根元素 rootEl ,并给它添加了相对定位及 margin 属性，这样整个根元素会在容器中水平居中。

#### 3.4.2 瀑布流加载 loadFalls 方法

> 这里有一些前置属性及初始逻辑

```
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
```

以代码空行来拆分：

- 第一部分：__属性定义__，见注释。

- 第二部分：__逻辑部分__
    - 如果是第一次渲染，就依次初始化，执行 addItem 添加图片列表，然后标记 this.first 为 false，并且记录当前的列数 this.lastCol
    - 非第一次渲染，只有列数改变时才重新渲染瀑布流，this.startIndex 是图片数组的标记位，后面会讲到。

#### 3.4.3 生成高度列表 storageHeight 方法

```
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
```

根据列数生成一个存储每列下一张图片 top 及 left 值的数组，top 初始都为 0 ，left 为每列的宽度 * 列数；

#### 3.4.4 添加图片队列 addItem 方法

```
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
```

这一块有点长，因为有两处为 dom 对象添加属性，主要逻辑如下：
- 1、变量声明，保存 this ,复制图片数组至 imgList（因为后面会对数组进行更改）；
- 2、创建 addImg 方法添加单个图片进根元素，在图片的 onload 事件里递归 addImg 添加下一张图片；
> 只有在图片加载完成后才能获取图片高度，进行 topArr 的更新

- 3、在 addImg 函数内，首先遍历出当前最小 top 值，及对应的列数 index；
- 4、生成图片容器元素 item ，并添加属性及暴露的类名 itemClass；
- 5、生成图片元素 img ,并添加属性，图片宽度100%；
- 6、依次添加图片及图片容器至根元素，注意先后顺序；
- 7、进入 onload 事件内，首先需要更新 topArr 对应序号的 top 值，因为该位置新增了一张图片
- 8、求出总高度更新根元素高度（防止根元素后面其他页面元素布局混乱）；
- 9、如果 imgList 内还有数据，递归完成图片添加
- 10、如果 imgList 无数据：
> - 记录图片索引至 startIndex ，新增图片数据后只需从 startIndex 位置开始添加
> - 检查回调队列 callback 内是否有回调事件，如果有，取出第一条进行处理（回调队列后面解释）

#### 3.4.5 监听宽度变化 bindEvent 方法

```
prototype.bindEvent = function () {     // 通过 resize 事件监听容器宽度变化
    window.addEventListener('resize', this.loadFalls.bind(this));
};
```

为 window 对象的 resize 事件添加监听，触发 loadFalls 函数，这里通过bind修正了方法内部的 this 指向；

#### 3.4.6 生成一个瀑布流实例 init 方法

```
prototype.init = function () {  //  生成一个瀑布流实例
    this.initialize();
    this.loadFalls();
    this.bindEvent();
    return this;    // 返回实例对象
};
```

就是依次调用 初始化 添加图片 绑定事件 三个方法，这里返回了 this ，用于保存当前实例，下一步会用到；

#### 3.4.7 添加图片后重新绘制 addImgReload 方法

```
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
```

上面为了这一步做了很多铺垫
> - this.loadAll 保存当前图片队列是否全部加载完成
> - 如果当前图片队列已经加载完成，那就跟新图片队列 this.imgList ，继续加载 this.addItem()，因为已经存储了 startIndex ，所以会从新增的图片继续加载
> - 如果当前图片队列还没加载完成，将更新图片的任务推进回调队列 callback ，当前图片队列加载完成后会检测回调队列，取出更新图片任务完成，就算有多个图片更新事件也不要紧， callback 保持先进先出执行顺序；


## 四、总结

- 似乎没有提懒加载
> 通过 addImgReload 方法分次跟新图片属性可以实现懒加载

- 图片数据可以根据实际扩充，此处只添加了 src 及 alt ,包括超链接可以修改外层容器 item 或者再套一层；

- 代码写完没有做优化，有几段比较长，有空再优化吧，毕竟快下班了

- 最后，个人能力有限，欢迎大佬补充，谢谢！！！














