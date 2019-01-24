## 《你不知道的javaScript》--类型

---

### 内置类型
#### javaScript有七种内置类型

- 空值（null）
- 未定义（undefined）
- 数字（number）
- 字符串（string）
- 对象（object）
- 符号（symbol,ES6新增）

> 可以用typeof运算符来查看值的类型，它的返回值是类型的字符串值

```
typeof undefined;           // "undefined"
typeof true;                // 'boolean'
typeof 42;                  // 'number'
typeof '42';                // 'string'
typeof { life: 42 };        // 'object'
// ES6中新加入的类型
typeof Symbol();            // 'symbol'
// 例外
typeof null;                // 'object'
```

> 可以用复合条件来检测null值的类型

```
var a = null;
function isNull(val) {
    return (!val && typeof val === 'object');
}

console.log(isNull(a));           // true
```

> 虽然typeof function会返回‘function’，但是function只是object的一个“子类型”，具体来说，函数是一个可调用的对象，它通过内部的[[Call]]属性实现调用

```
var fn = function (a, b) {
    console.log(a + b);
};
console.log(typeof fn);          // 'function'
// 函数还可以拥有属性
console.log(fn.length);          // 2
```
#### 数组
> 数组可以容纳任何类型的值

```
var arr = [1, 'a', [3, 4], null, {a: 1, b: 2}];
console.log(arr.length);         // 5
```
> 使用delete运算符可以将单页从数组中删除，但是删除后数组的length属性不会发生变化

```
delete arr[1];
console.log(arr);                // [1, empty, Array(2), null, {…}]
console.log(arr.length);         // 5
```


