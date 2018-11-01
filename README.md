# yuanaaa
> 一个弱鸡的日常...

---

### 【阅读笔记】
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/ReadingNotes)
+ [《你不知道的javaScript》--类型](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-01.md)
+ [Javascript偏函数与柯里化](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-02.md)
+ [CSS三栏布局](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-03.md)
+ [使用js对各种格式文件进行操作的实现](https://github.com/wuyuanaaa/yuanaaa/blob/master/ReadingNotes/notes-04.md)

---

### 【工具配置】静态页面切图gulp配置

> 一套自用的便于静态页面切图的gulp配置，因为公司页面经常改动，没有添加压缩等功能

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/deploy-gulp)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/deploy-gulp/index.html)
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
- 2、命令行中输入以下
```
npm init
```
- 3、覆盖node_modules_revise文件夹中的文件至node_modules(此处对gulp-rev gulp-rev-collector进行了部分修改)
#### 命令列表
```
// 启动browser-sync less文件变化后启动gulp-less
gulp
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

[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/page7) [页面预览](https://wuyuanaaa.github.io/yuanaaa/page7/index.html)
#### 主要功能
+ 文本框及背景自动适应高度（默认有最小高度）
+ 文本框失焦后清除除去加粗、换行、空格外的格式，保证文字统一协调
+ 文本格式清除后所见即所得
+ 一键下载合成后的图片（火狐之外的浏览器下载大文件出错，增加手动下载支持）

---

### 【小练习】
#### css01-固定背景实现CSS水波纹
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/css-demo/css-01)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/css-demo/css-01/index.html)
+ 主要利用多层叠加div的background-attachment、background-size、animation属性

#### css02-CSS仿ios按钮
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/css-demo/css-02)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/css-demo/css-02/index.html)
+ 主要利用position、transition属性

#### css03-CSS实现跟随鼠标方向进入动效导航
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/css-demo/css-03)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/css-demo/css-03/index.html)
+ 相邻选择器‘~’的妙用

#### css04-CSS实现边框转动效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/css-demo/css-04)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/css-demo/css-04/index.html)
+ 主要利用background的linear-gradient径向渐变

#### css05-CSS实现边框转动效果
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/css-demo/css-05)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/css-demo/css-05/index.html)
+ css02及css03的延伸

---

### 【小练习】一个轮播demo

> (此版为初始demo，bug较多，后续版本已整合进[yuanaaa.js](https://github.com/wuyuanaaa/yuanaaa.js))

 [文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/slider)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/slider/index.html)
