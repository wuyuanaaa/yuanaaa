#  :clipboard:yuanaaa


---

### 【阅读笔记】
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/ReadingNotes)
+ [《你不知道的javaScript》--类型](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-01.md) _--2018.10.27_
+ [Javascript偏函数与柯里化](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-02.md) _--2018.11.19_
+ [CSS三栏布局](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-03.md) _--2018.11.03_
+ [js文件操作总结一：图片篇](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-04.md) _--2018.11.06_
+ [js二叉树整理](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-05.md) _--2018.11.28_
+ [代码片段整理](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-06.md) _--2018.12.08_
+ [原生js实现瀑布流](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-07.md) _--2018.12.12_
---

### 【css】页面加载 loading 动画——种树

> 纯 css 实现，可萌了，已经用到了个人博客 [点这里查看效果](https://blog.yuanaaa.top)

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/loading-tree)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/loading-tree/index.html)

---

### 【js】一个假的九宫格抽奖

> 简单实现，没有做封装

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/sweepstakes)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/sweepstakes/index.html)

#### 使用说明

- 原生 js 实现，引用 JQ 只为 消息提醒 layer 提供依赖；
- CSS 用到了 flex 布局，需考虑兼容
- 可以设定以下参数
    - 转多少圈后开始抽奖
    - 各个奖品的概率
    - 能够抽奖的次数

---

### 【js】面对对象版瀑布流

> 实现根据图片数据渲染瀑布流

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/falls)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/falls/index.html)

#### 使用说明

- 默认参数调用方式如下：
```
var fall = falls.init('#root', {
    imgList: src
})     // src 为一个包含多个对象的数组，每个对象都含有'src','alt'属性；
```
- 支持图片数据新增时，渲染新增数据
```
fall.addImgReload(src);
```
- 完整说明[点击这里](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-07.md)

---

### 【js】面对对象版气泡背景生成

> 实现添加气泡背景

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/bubble)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/bubble/index.html)

#### 使用说明

- 动画由CSS3实现，需添加CSS样式（见demo）
- 默认调用如下

```
bobbles.init(num, options);      // num 表示气泡数量      options 表示参数对象
```

- 可修改默认参数包含：宽度范围 动画延迟范围 动画速度（见demo）

---

### 【Polyfill】JS的兼容整理

> 之前一直在回避兼容问题，大部分代码都是依赖jquery，决定开始正视原生写法，暂时分成了两类
> - 【补充类】：对没有该功能的版本进行补充
> - 【兼容类】：对实现方式不一致进行兼容
> - 持续更新

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/Polyfill/polyfill.js)


---

### 【js】面对对象版轮播组件

> - 非常感谢慕课网的[《星级评分原理和实现》](https://www.imooc.com/learn/842)课程，名字看起来很基础，但是讲的东西超级实用
> - 最近一直觉得自己的代码没有逻辑，且维护、复用、拓展都很复杂，看了很多面对对象的理论，具体下手写起来又不知道怎么办╮(￣▽￣")╭
> - 这是通过课程学习后实现的第一版，后续会持续更新（最终目的要实现yuanaaa.js更新面对对象的3.0版本）

 [文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/slider-new)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/slider-new/index.html)

 - 18.11.10：实现初始版本；
 - 18.11.11：新增父类继承，添加淡出淡入新模式
 - 18.11.15：已经更新至[yuanaaa.js的3.0版](https://github.com/wuyuanaaa/yuanaaa.js/tree/master/3.0)，此版demo不再更新

---

### 【工具配置】静态页面切图gulp配置

> 一套自用的便于静态页面切图的gulp配置，因为公司页面经常改动，没有添加压缩等功能

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/gulpDeploy)
#### 主要功能
+ 【browser-sync】--自动刷新、多端调试
+ 【gulp-less】--less编译
+ 【gulp-autoprefixer】--自动添加css前缀
+ 【gulp-tinypng-compress/gulp-tinypng-nokey】--图片压缩
> （gulp-tinypng-compress需要去[TinyPNG官网](https://tinypng.com/)申请key，gulpfile.js中的私人key已更换为*号，gulp-tinypng-nokey无需key）

+ 【gulp-rev、gulp-rev-collector】--添加版本号
+ 【gulp-sequence】--gulp的同步执行
#### 使用方法
- 1、拷贝所有文件至项目文件夹
- 2、全局安装gulp
```
npm install gulp -g
```
- 3、在项目文件夹内运行以下命令
```
npm install
```
- 4、覆盖node_modules_revise文件夹中的文件至node_modules(此处对gulp-rev gulp-rev-collector进行了部分修改)
#### 命令列表
```
// 启动文件监听 less 文件中 px 转换 rem , 同 gulp m
gulp
// 启动文件监听 less 文件中 px 转换 rem
gulp m
// 启动文件监听 不进行 px 转换
gulp pc
// 同步执行 添加css3前缀 添加版本号
gulp build
// 图片压缩1（需要key）
gulp tinypng
// 图片压缩2
gulp tp
```
#### 注意事项
- 1、因为gulp-rev gulp-rev-collector进行了部分修改，所以gulp-rev建议版本为@8.0.0，gulp-rev-collector建议版本为@1.1.1，修改过程参考自[此处](https://www.cnblogs.com/lakeInHeart/p/7257443.html)
- 2、如需修改目录结构需对应修改gulpfile.js文件内容
- 3、px2rem 默认 1rem = 75px;

#### 更新
- 19.4.7：更新支持px2rem；
- 19.4.8：新增命令 PC 页面时不启用px2rem；

---

### 【功能页面】海报二维码合成

> 公司经常需要一张海报放不同的销售人员的二维码，而大部分销售并不会使用PS等工具，由设计一张张更换又太费时间，所以写了这样的一个功能页面

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/imgCompound)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/imgCompound/index.html)
#### 主要功能
+ 根据两条垂直的白线定位二维码,并设置二维码宽度
+ 支持手动拖放修改二维码位置及宽度
+ 合成成功后实时预览
+ 一键下载合成后的图片

---

### 【功能页面】早报图片生成

> 方便每天固定的朋友圈图片生成，样式固定，内容可自由编辑

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/poster) [页面预览](https://wuyuanaaa.github.io/yuanaaa/poster/index.html)
#### 主要功能
+ 文本框及背景自动适应高度（默认有最小高度）
+ 文本框失焦后清除除去加粗、换行、空格外的格式，保证文字统一协调
+ 文本格式清除后所见即所得
+ 一键下载合成后的图片（火狐之外的浏览器下载大文件出错，增加手动下载支持）

---

### 【css】
#### css01-固定背景实现水波纹
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#water-ripple)
+ 主要利用多层叠加div的background-attachment、background-size、animation属性

#### css02-仿ios按钮
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#toggle)
+ 主要利用position、transition属性

#### css03-跟随鼠标方向进入动效导航
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#nav)
+ 相邻选择器‘~’的妙用

#### css04-边框转动效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#rotary-border)
+ 主要利用background的linear-gradient径向渐变

#### css05-两种小球移动效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#ball-move)
+ css02及css03的延伸

#### css06-信纸效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#letter-paper)
+ linear-gradient box-shadow 属性的妙用

#### css07-按钮loading效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#loading)
+ 纯 CSS loading 动画，copy自张鑫旭博客

#### css08-点击出现小心心
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/demo/01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/demo/01/index.html#lovely)
+ 讨女朋友开心

---

### 【js】一个轮播demo

> (此版为初始demo，bug较多，后续版本已整合进[yuanaaa.js](https://github.com/wuyuanaaa/yuanaaa.js))

 [文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/slider)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/slider/index.html)
