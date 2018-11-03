## js文件操作总结一：图片篇

---

#### 本篇主要涉及到：
- 文件的上传
- 图片文件的编辑
- 编辑后的图片文件下载
---

### 文件的上传
> __文件上传目前了解的主要有三种方式：__
> - type="file"的input输入框
> - drop拖放事件；
> - 另有"ctrl+V"进行粘贴，但是此方法使用有局限性，如：不支持windows系统文件的复制粘贴（大概理解为windows系统的粘贴只是对文件路径的引用）

#### 一、input文件上传
html部分
```
<input id="fileInput" type="file" accept="image/png, image/jpeg">
// accept定义支持的文件类型
```
js获取文件
```
$('#fileInput').on('change', function () {
    fn(this.files[0]);
})
// this.files是一个文件集合，如果一次性上传多个文件相应就是this.files[0]、this.files[1]...
```

#### 二、drop拖放文件上传
html部分可以是一个div元素就行
```
<div class="dropBox" id="dropHere">
    <p class="info">把文件拖放到这里</p>
    <p class="info hide">你上传的文件是：<span id="fileName"></span></p>
</div>
```
js操作部分需要对目标元素的ondragenter和ondragover进行阻止默认事件操作，防止浏览器直接打开文件
```
// 拖拽上传事件
function bandDropEvent (el,fn) {
    el.ondragenter = function (event) {   // 清除默认事件，防止浏览器直接打开图片文件
        event.stopPropagation();
        event.preventDefault();
    };
    el.ondragover = function (event) {   // 清除默认事件，防止浏览器直接打开图片文件
        event.stopPropagation();
        event.preventDefault();
    };
    el.ondrop = function (event) {
        event.stopPropagation();
        event.preventDefault();
        fn(event.dataTransfer.files[0]);
    };
}
```
__更好的做法是在div里再放一个type='file'的input，然后绑定点击div事件触发input的点击事件，这样就可以同时支持点击及拖放上传__

[这里是一个demo](https://wuyuanaaa.github.io/yuanaaa/demo/07/index.html)

---

### 图片文件的编辑

> 解决完文件上传之后，接着就需要对文件数据进行操作啦！首先我们拿图片文件来练手，这里我们分几个步骤：

#### 一、图片预览的实现

__首先需要了解一个API：FileReader；__

> FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。---来自MDN

直接上代码
```
function file2url(file, fn) {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
        const src = reader.result;
        fn(src);
    }, false);
    reader.readAsDataURL(file);
}
```
- 1、首先我们初始化一个__FileReader__的实例__reader__;
- 2、然后我们监听实例__reader__的__load__事件，将__reader.result__中包含的数据保存到变量__src__
- 3、最后我们调用__reader.readAsDataURL()__方法处理目标文件__file__；

通过FileReader.readAsDataURL()方法，我们可以成功将图片文件转换成一串以__URL格式的字符串__（base64编码）表示所读取文件的内容(FileReader还可以将文件转换成其他格式，见下文),我们可以将转换后的url赋值给img元素的src属性，这样就可以查看图片预览了

```
fileInput.addEventListener('change', function () {
    showFileName(this.files[0]);
    file2url(this.files[0], function (src) {
        document.querySelectorAll('img')[0].src = src;
    })
});
```
稍微修改一下上一步的demo，让它实现图片预览的功能，[点击这里查看](https://wuyuanaaa.github.io/yuanaaa/demo/08/index.html)

#### 二、图片文件的编辑

> 属性PS的肯定知道，在位图里整张图片由N多的像素点组成，每一个小的像素点可以想象成一个小的色块，N多色块拼接在一起就成了我们最终看到的图片，如果能操作每个像素点的色值，就能够对图片进行编辑了，我们开始吧：

__首先还是~~一个~~几个API：__

- 1、[CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)：在canvas上绘制目标图片

- 2、[CanvasRenderingContext2D.getImageData()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData)：获取canvas内容的数据

- 3、[CanvasRenderingContext2D.putImageData()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData)：将已有的图片数据绘制到canvas

代码有点长，直接看demo吧，[点击这里查看](https://wuyuanaaa.github.io/yuanaaa/demo/09/index.html)

