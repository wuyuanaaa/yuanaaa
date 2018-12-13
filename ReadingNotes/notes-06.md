# 代码片段

> 日常看帖子跟着敲下来的或者突然想到的一些代码片段，放在桌面舍不得删，抽空整理一下；

## 目录

__函数相关__

- [模拟call](#模拟-call)
- [模拟apply](#模拟-apply)
- [模拟bind](#模拟-bind)
- [多个函数依次调用](#多个函数依次调用-pipe)
- [防抖函数](#防抖函数-debounce)
- [节流函数](#节流函数-throttle)

__数组相关__

- [数组元素计次](#数组元素计次-getarrayvaluecount)
- [数组快速筛选](#数组快速筛选-other)
- [数组扁平化](#数组扁平化-flatten)

__对象相关__

- [MessageChannel 实现深拷贝](#messagechannel-实现深拷贝)


__其他__

- [数据类型](#数据类型-type)
- [](#)

---

### 模拟 call

```
Function.prototype._call = function (context) {
    context = context || window;
    context.fn = this;

    const args = [...arguments].slice(1);
    const result = context.fn(...args);

    delete context.fn;
    return result;
};
```

### 模拟 apply

```
Function.prototype._apply = function (context) {
    context = context || window;
    context.fn = this;

    var result;
    if (arguments[1]) {
        result = context.fn(...arguments[1]);
    } else {
        result = context.fn();
    }

    delete context.fn;
    return result;
};
```

### 模拟 bind

```
Function.prototype._bind = function (context) {
    const args = Array.prototype.slice.call(arguments, 1);
    const fn = this;
    return function () {
        const innerArgs = Array.prototype.slice.call(arguments);
        const finalArgs = args.concat(innerArgs);
        return fn.apply(context, finalArgs);
    }
};
```

### 多个函数依次调用 pipe

```
const pipe = (...fn) => (value) => fn.slice().reduce((fn1, fn2) => fn2(fn1), value);
// pipe(fn1, fn2, fn3, fn4)(...arg);
```


### 防抖函数 debounce

- 防抖函数1

```
/*
* immediate = true 初始立即执行一次
* 之后一段时间内只在事件停止后执行一次
* */
function debounce(func, wait = 1000, immediate = true) {
    let timeout;
    return function () {
        var context = this;
        var args = arguments;

        if(immediate) {
            immediate = false;
            func.apply(context, args);
        }else {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait)
        }
    }
}
// immediate 是否立即执行
```

- 防抖函数2

```
/*
* immediate = true 只在事件触发初始执行一次，事件结束后 wait 时间内，不触发事件，
* 事件结束后 wait 时间后，首次触发再执行一次
* */
function debounce(func, wait = 1000, immediate = true) {
    let timer, context, args;
    const later = () => setTimeout(() => {
        timer = null;
        if(!immediate) {
            func.apply(context, args);
            context = args = null;
        }
    }, wait);

    return function (...params) {
        if (!timer) {
            timer = later();
            if (immediate) {
                func.apply(this, params);
            } else {
                context = this;
                args = params;
            }
        } else {
            clearTimeout(timer);
            timer = later();
        }
    }
}
```

### 节流函数 throttle

- 节流函数1

```
function throttle(func, wait) {
    let timeout, context, args;
    return function () {
        context = this;
        args = arguments;
        if(!timeout) {
            timeout = setTimeout(function () {
                timeout = null;
                func.apply(context, args);
            }, wait)
        }
    }
}
```

- 节流函数2

```
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
function throttle (func, wait, options = {}) {
    var context, args, result;
    var timeout = null;
    var previous = 0;

    var later = function () {
        previous = options.leading === false ? 0 : +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };

    return function () {
        var now = +new Date();
        if (!previous && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
```

---

### 数组元素计次 getArrayValueCount

```
function getArrayValueCount(arr) {
    return arr.reduce((obj, key) => {
        obj[key] = obj[key] ? ++obj[key] : 1;
        return obj;
    }, {});
}
```

### 数组快速筛选 other

```
let {_a, _b, ...other} = {a: 1, b: 2, _a: 2, _b: 4, c: 5, d: 6};
// other = {a: 1, b: 2, c: 5, d: 6}
```



### 数组扁平化 flatten

```
// 版本1
function flatten1(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

// 版本2
function flatten2 (arr) {
    return arr.reduce((base, val) => Array.isArray(val) ? base.concat(flatten2(val)) : base.concat(val), [])
}
```

---

### MessageChannel 实现深拷贝

```
function structuralClone(obj) {
    return new Promise(resolve => {
        const {port1, port2} = new MessageChannel();
        port2.onmessage = ev => resolve(ev.data);
        port1.postMessage(obj);
    })
}
const clone = structuralClone(obj1);
clone.then(o => {
    console.log(o);
})
```


---

### 数据类型 type

```
let class2type = {};

'Boolean Number String Function Array Date RegExp Object Error'.split(' ').map(function (item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
});

function type(obj) {
    // null 和 undefined
    if(obj == null) {
        return obj + '';
    }
    return typeof obj === "object" || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
```

### Promise 版本ajax

```
const getJSON = function (url) {
    return  new Promise(function (resolve, reject) {
        const handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };

        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();
    });
};
```






