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

[这里是一个demo](https://wuyuanaaa.github.io/yuanaaa/demo/07/index01.html)

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
稍微修改一下上一步的demo，让它实现图片预览的功能，[点击这里查看](https://wuyuanaaa.github.io/yuanaaa/demo/07/index02.html)

#### 二、图片文件的编辑

> 熟悉PS的肯定知道，在位图里整张图片由N多的像素点组成，每一个小的像素点可以想象成一个小的色块，N多色块拼接在一起就成了我们最终看到的图片，如果能操作每个像素点的色值，就能够对图片进行编辑了，我们开始吧：

__首先还是~~一个~~几个API：__(一个个介绍有点长，请自行点击链接去查看相关信息)

- 1、[CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)：在canvas上绘制目标图片

- 2、[CanvasRenderingContext2D.getImageData()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData)：获取canvas内容的数据

- 3、[CanvasRenderingContext2D.putImageData()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData)：将已有的图片数据绘制到canvas

试着用这几个API实现了将图片的像素点反色，主要代码如下：
```
// 将图片反色
function inverse(src) {
    const img = new Image,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    let w,h,data;
    img.src = src;
    const imgLoad = new Promise((resolve, reject) => {
        img.onload = function () {
            w = this.width;
            h = this.height;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(this, 0, 0, w, h);
            data = ctx.getImageData(0, 0, w, h);
            const obj = {
                data: data,
                width: w,
                height: h
            };
            resolve(obj);
        };
    });
    // 改变图片像素
    imgLoad.then((val) => {
        return new Promise((resolve, reject) => {
            let imgData = val.data.data;
            let w = val.width;
            let h = val.height;
            for(let i = 0; i < h; i++) {        // 遍历像素点
                for(let j = 0; j < w; j++) {
                    let x = i * 4 * w + 4 * j;
                    imgData[x] = 255 - imgData[x];
                    imgData[x + 1] = 255 - imgData[x + 1];
                    imgData[x + 2] = 255 - imgData[x + 2];
                }
            }
            ctx.putImageData(data, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", 1));
        });
    }).then(function (url) {
        document.querySelector('.showNewImg').src = url;
    });
}
```
__需要注意的地方__
- 文件的操作是异步进行的，此处用了Promise；
- 对像素点的处理用到了嵌套的循环，外层循环X轴，内层循环Y轴上与之交叉的像素点，每一个像素点由4个数据表示，分别对应RGBA；
> 因此第一个下标（对应R）值为：X轴序号 * 数据基数 *  图片宽度，每条X轴上的像素点数 + 数据基数 * Y轴序号

将图片反色的demo，[点击这里查看](https://wuyuanaaa.github.io/yuanaaa/demo/07/index03.html)。

---

### 编辑后的图片文件下载

> 下载的实现用到a标签的download属性；

主要代码如下：

```
function download(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
}
```

增加下载功能的demo，[点击这里查看](https://wuyuanaaa.github.io/yuanaaa/demo/07/index04.html)。

### 总结

- 图片的操作还能实现很多其他的效果，这里贴一个之前写的[二维码图片合成页面](https://wuyuanaaa.github.io/yuanaaa/imgCompound/index.html)，当初写这个页面花费了好长时间查找资料等，本篇内容出自该页面的梳理；

- 接下来还会继续整理，dom转换图片，.html文件编辑等其他文件相关操作；

- 源码都在链接里的github里，或者[直接点这里](https://github.com/wuyuanaaa/yuanaaa)；

- __PS：本篇主要对图片的操作做了个简单的总结，代码的实现并没有考虑兼容等（最喜欢写demo这种无拘无束放飞自我的感觉），限于作者能力有限，相关代码仅作示范，如有不足，烦请告知，谢谢__
