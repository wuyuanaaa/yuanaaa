# yuanaaa
一个弱鸡的日常...

## 一个轮播demo
##### (此版为初始demo，bug较多，后续版本已整合进[yuanaaa.js](https://github.com/wuyuanaaa/yuanaaa.js))
 [文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/slider)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/slider/index.html)

## 海报二维码合成功能页面
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/imgCompound)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/imgCompound/index.html)
#### 主要功能
+ 根据两条垂直的白线定位二维码,并设置二维码宽度
+ 支持手动拖放修改二维码位置及宽度
+ 合成成功后实时预览
+ 一键下载合成后的图片

## 静态页面切图gulp配置
[文件地址](https://github.com/wuyuanaaa/yuanaaa/tree/master/deploy-gulp)    [页面预览](https://wuyuanaaa.github.io/yuanaaa/deploy-gulp/index.html)
#### 主要功能
+ browser-sync--实现自动刷新、多端调试
+ gulp-less--实现less编译
+ gulp-autoprefixer--实现自动添加css前缀
+ gulp-tinypng-compress/gulp-tinypng-nokey--实现图片压缩（gulp-tinypng-compress需要去[TinyPNG官网](https://tinypng.com/)申请key，gulpfile.js中的私人key已更换为*号，gulp-tinypng-nokey无需key）
+ gulp-rev gulp-rev-collector--实现自动添加版本号
#### 使用方法
- 1、拷贝所有文件至项目文件夹
- 2、命令行中输入以下
```
npm init
```
- 3、覆盖node_modules_revise文件夹中的文件至node_modules(此处对gulp-rev gulp-rev-collector进行了部分修改)
#### 命令列表
```
// 启动browser-sync gulp-less
gulp
// 添加css3前缀
gulp css3
// 添加版本号(此步骤需在css3后)
gulp rev
// 图片压缩1（需要key）
gulp tinypng
// 图片压缩2
gulp tp
```
#### 注意事项
- 1、因为gulp-rev gulp-rev-collector进行了部分修改，所以gulp-rev建议版本为@8.0.0，gulp-rev-collector建议版本为@1.1.1，修改过程参考自[此处](https://www.cnblogs.com/lakeInHeart/p/7257443.html)
- 2、如需修改目录结构需对应修改gulpfile.js文件内容
