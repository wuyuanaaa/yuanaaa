## js文件操作总结

---

> 本篇主要涉及到：
> - 文件的上传
> - 图片文件的编辑
> - 文本文件的编辑（这里的文本文件指能够被JS转换为字符串的文件格式，包括QQ聊天记录的.mht，网页文件.html等）
> - dom转换成图片
> - 通过url获取html文件内容
> - 编辑后的图片文件下载
> - 编辑后的.html文件下载

### 文件的上传
> 文件上传目前了解的主要有三种方式：
- type="file"的input输入框
- drop拖放事件；
- 另有"ctrl+V"进行粘贴，但是此方法使用有局限性，如：不支持windows系统文件的复制粘贴（大概理解为windows系统的粘贴只是对文件路径的引用）

#### input文件上传
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

#### drop拖放文件上传
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
        var file = event.dataTransfer.files[0];
        fn(file);
    };
}
```
[这里是一个demo](https://wuyuanaaa.github.io/yuanaaa/demo/07/index.html)

待续。。。


