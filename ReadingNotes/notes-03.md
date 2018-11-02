## 三栏布局

> 三种两边定宽，中间自适应的布局方式

[demo](https://wuyuanaaa.github.io/yuanaaa/demo/06/index.html)
---

### 圣杯布局

html
```
<div class="container01">
    <div class="header">header</div>
    <div class="wrapper clearfix">
        <div class="main col">main</div>
        <div class="left col">left</div>
        <div class="right col">right</div>
    </div>
    <div class="footer">footer</div>
</div>
```
css
```
.container01 {
    width: 500px;
    margin: 20px auto;
}
.container01 .header,
.container01 .footer {
    height: 50px;
    background: #52cfa5;
}
.container01 .wrapper {
    padding: 0 100px 0 100px;
}
.container01 .col {
    position: relative;
    float: left;
}
.container01 .main {
    width: 100%;
    height: 200px;
    background: #fbfa95;
}
.container01 .left {
    width: 100px;
    height: 200px;
    margin-left: -100%;
    left: -100px;
    background: #007aff;
}
.container01 .right {
    width: 100px;
    height: 200px;
    margin-left: -100px;
    right: -100px;
    background: #fd8a99;
}
```

### 双飞翼布局

html
```
<div class="container02">
    <div class="header">header</div>
    <div class="wrapper clearfix">
        <div class="main col">
            <div class="main-wrap">main</div>
        </div>
        <div class="left col">left</div>
        <div class="right col">right</div>
    </div>
    <div class="footer">footer</div>
</div>
```
css
```
.container02 {
    width: 500px;
    margin: 20px auto;
}
.container02 .header,
.container02 .footer {
    height: 50px;
    background: #52cfa5;
}
.container02 .col {
    float: left;
}
.container02 .main {
    width: 100%;
    background: #fbfa95;
}
.container02 .main-wrap {
    margin: 0 100px 0 100px;
    height: 200px;
}
.container02 .left {
    width: 100px;
    height: 200px;
    margin-left: -100%;
    background: #007aff;
}
.container02 .right {
    width: 100px;
    height: 200px;
    margin-left: -100px;
    background: #fd8a99;
}
```

### 定位布局

html
```
<div class="container03">
    <div class="header">header</div>
    <div class="wrapper">
        <div class="main">main</div>
        <div class="left">left</div>
        <div class="right">right</div>
    </div>
    <div class="footer">footer</div>
</div>
```
css
```
.container03 {
    width: 500px;
    margin: 20px auto;
}
.container03 .header,
.container03 .footer {
    height: 50px;
    background: #52cfa5;
}
.container03 .wrapper {
    position: relative;
    overflow: hidden;
}
.container03 .main {
    padding: 0 100px 0 100px;
    box-sizing: border-box;
    width: 100%;
    height: 200px;
    background: #fbfa95;
}
.container03 .left {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    height: 300px;
    background: #007aff;
}
.container03 .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
    height: 100px;
    background: #fd8a99;
}
```

### 总结

##### 圣杯
- 优点：结构简单，无多余 dom 层
- 缺点：中间部分宽度小于左侧时布局混乱

##### 双飞翼
- 优点：支持各种宽高变化，通用性强
- 缺点：dom 结构多余层，增加渲染树生成的计算量

##### 定位
- 优点：结构简单，且无需清除浮动
- 缺点：两侧高度无法支撑总高度
