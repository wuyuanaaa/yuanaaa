## Javascript惰性函数、偏函数、柯里化

---

### 惰性函数

> 创造一个新函数，只有在__首次调用__时才返回特定值

- 实际应用

DOM 事件添加中，为了兼容 IE ,会有如下判断

```
function addEvent (type, el, fn) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, false);
    }
    else if (window.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}
```
以上代码在每一次调用的时候都会进行一次判断。
可以利用惰性函数改写为：

```
function addEvent (type, el, fn) {
    if (window.addEventListener) {
        addEvent = function (type, el, fn) {
            el.addEventListener (type, fn, false);
        }
    }
    else if (window.attachEvent) {
        addEvent = function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
}
```

还可以使用闭包的形式：

```
var addEvent = (function(){
    if (window.addEventListener) {
        return function (type, el, fn) {
            el.addEventListener(type, fn, false);
        }
    }
    else if(window.attachEvent){
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
})();
```

这样，在函数的第一次调用后， addEvent 就被赋值成另外一个函数了。


---

### 偏函数

> 创造一个新函数，让现有的一些参数值固定

```
function mul(a, b) {
    return a * b;
}
let double = mul.bind(null, 2);

console.log(double(3));         // 6
console.log(double(4));         // 8
```

> 使用没有上下文的偏函数

```
function partial(func, ...argsBound) {
    return function (...args) {
        return func.call(this, ...argsBound, ...args)
    }
}

const user = {
    firstName: 'John',
    say(time, phrase) {
        console.log(`[${time}] ${this.firstName}: ${phrase}!`);
    }
};

user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow('Hello');
```
### 柯里化

> 转换一个调用函数f(a,b,c)为f(a)(b)(c)方式调用。

```
function curryTest(func) {
    return function (a) {
        return function (b) {
            return func(a, b);
        };
    };
}

function fn(a, b) {
    return a + b;
}

const carriedFn = curryTest(fn);

console.log(carriedFn(1)(2));          // 3
```

> 高级柯里化实现

```
function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args)
        }else {
            return function (...args2) {
                return curried.apply(this,args.concat(args2));
            }
        }
    }
}

function sum(a, b, c) {
    return a + b + c;
}

const curriedSum = curry(sum);

console.log(curriedSum(1, 2, 3));         // 6
console.log(curriedSum(1, 2)(3));         // 6
console.log(curriedSum(1)(2)(3));         // 6
```

### 总结
- 当函数的每次调用都需要进行判断时，可以想想是否可以使用惰性函数来处理。
- 当把已知函数的一些参数固定，结果函数被称为偏函数，通过使用bind获得偏函数，也有其他方式实现。
- 当我们不想一次一次重复相同的参数时，偏函数是很便捷的。如我们有send(from,to)函数，如果from总是相同的，可以使用偏函数简化调用。
- 柯里化是转换函数调用从f(a,b,c)至f(a)(b)(c).Javascript通常既实现正常调用，也实现参数数量不足时的偏函数方式调用。



