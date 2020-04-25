---
title: JavaScript异步操作的总结
category: JavaScript
description: 本文概括地总结了JavaScript异步操作的起因、原理以及优化的历史。目前对于异步操作的优化已经成熟，为了避免在平时写出令人困惑的代码，其次为了加强自己的记忆，对这部分知识作了总结。
date: 2020-04-25
---

### 一、异步与事件循环

#### 什么是异步

1. **为什么`JavaScript`会有异步**：我们知道`JavaScript`是单线程的语言，如果不存在异步机制，如果遇到阻塞的代码，线程就会等着这些阻塞的代码完成之后，再继续下一步的操作。这种执行程序的方式，其实没有什么不妥，但是如果把执行的环境放到浏览器当中，就会出现很大的问题。

   浏览器中运行的`JavaScript`可能需要处理大量的网络请求，我们不知道这些网络请求何时会完成，这个时间是没有办法预估的，所以为了用户体验，线程不可能什么都不做。

   因此，针对这种场景，设计了异步机制。也就是说，类似网络请求的异步代码，<u>发起之后由运行时托管</u>，线程继续向后执行代码。

2. **异步的实现原理**：看一个`jQuery`网络请求的🌰：

   ```javascript
   let ajax = $.ajax({
   	url: '/data.json',
     success: () => {
       //do something
     }
   })
   ```

   这里向`$.ajax()`传入2个参数，`url`及`success`，前者为请求路由，后者为请求成功之后，需要执行的函数，注意这个函数不是立即执行的，而是等待结果出来之后，再执行，这就是一个典型的回调函数`callback`。

   **实现异步最核心的原理，就是利用回调函数`callback`。**

#### 事件循环`Event-loop`

事件循环体现了单线程中异步操作的执行原理及过程。

### 二、`jQuery`的解决方式

#### 传统的`$.ajax`

在`jQuery v1.5`之前，使用的异步方式是传统的回调函数式：

```javascript
let ajax = $.ajax({
  url: '/data.json',
  success: () => {
    //do something
  },
  error: () => {
    //do something
  }
})
```

这种回调方式，**主要会引发2点问题**：

1. **回调地狱**：

   过深的嵌套，导致回调地狱，难以追踪回调的执行顺序。

2. **错误处理无法保证**：

   因为回调函数的调用逻辑是在请求函数的内部，我们实际上无法保证请求函数的正确调用，有可能会出现：回调返回错误的结果、吞掉可能出现的错误与异常、回调没有执行，回调被多次执行、回调被同步执行等等。**`try catch`是无法捕捉到回调函数的异常。**

   ```javascript
   //没有回调
   try {
     JSON.parse("{'a': '1'}")
   } catch(error) {
     console.log(error)//错误被捕获成功
   }
   //有回调
   try {
     setTimeout(() => {
       JSON.parse("{'a': '1'}")
     }, 0)
   } catch(error) {
     console.log(error)//不会执行到这里，直接报错
   }
   ```

#### 1.5版本之后的`$.ajax`

`jQuery`针对上面出现的问题，做了改进，实现了链式调用：

```javascript
let ajax = $.ajax('/data.json')
ajax.done(() => {
  //do something
}).fail(() => {
  //do something
}).done(() => {
  //do something
}).fail(() => {
  //do something
})
```

注意这里的`ajax`对象，其实是两种不同的类型的对象，前者是一个标准的`XHR`对象，而后者是一个`deferred`对象，所以它才会拥有`done`和`fail`方法。

**回调函数的嵌套，根本原因就是想要顺序执行多个异步操作，或者是想要拿到某个异步操作的结果，来执行下一个异步操作或者逻辑。回调的嵌套就是一种实现方式。而链式调用避免了嵌套的问题，同时也达到了上述的目的。**

#### 改进的好处

1. **`JavaScript`是一门异步执行的语言，但是人类的思维是同步的。**因此，为了适应人类的思维方式，开发者一直都在力求**使异步代码写起来更像是同步代码**。链式调用相比于传统的异步函数模式，更加方便开发者工作。
2. 注意前者的调用方式，我们需要把成功的操作全部写在`success`的`callback`中。而后者允许你将多个操作使用`done`方法链接起来。
3. 这种方式一定程度上，影响了`Promise`标准的制定。

### 三、ES6的`Promise`

在2015年6月发布的`ECMAScript6.0`对`JavaScript`很多痛点进行了大刀阔斧的改革，为了解决回调的问题，提供了`Promise`对象。`Promise`的基本使用，跟`jQuery`的链式调用非常相似。

`Promise`主要是**将异步的操作跟其对应的回调逻辑拆分开**：

```javascript
//封装一个简陋的get方法，返回一个Promise对象
const request = (url) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      success: (res) => {
        resolve(res);
      },
      error: (err) => {
        reject(err);
      }
    })
  })
}
```

定义回调逻辑：

```javascript
let request1 = request('/data.json');
request1.then((res) => {
  //do something
  return data//通过return返回值向后传递，这里也可以返回一个新的Promise对象
}).then((res) => {
  //do something
}).catch((err) => {
  //捕获错误
})
```

上面的行为，实际上是将异步操作封装进入一个形参为`resolve`及`reject`的函数中，将这个函数传入一个`Promise`构造函数。在异步操作成功的回调函数中，调用`resolve()`函数，标志着将控制权交给异步操作成功的逻辑，而调用`reject()`函数的调用，实际上是将控制权交给异步操作失败的逻辑。

简单来讲，`resolve()`函数以及`reject()`函数，是将`Promise`分成了两个状态。不同的状态执行不同的回调逻辑。

#### 错误处理

我们通过对`Promise`实例调用`then()`方法，定义`resolve`状态的回调逻辑，而通过`catch()`方法，定义`reject`状态的回调逻辑，**同时捕获错误**。

这里，`Promise`实际上，**同时解决了回调地狱的问题，以及错误捕获的问题。**

#### `Promise`与回调的区别

**要明确，`Promise`并不是回调的替代。它在回调代码和将要执行这个任务的异步代码之间提供了一种可靠的中间机制来管理回调。**

<u>使用回调的话，通知就是异步任务调用的回调。</u>而使用`Promise`，这个关系被反转，变成了侦听来自异步任务的事件，在得到通知之后，根据情况继续。

#### `Promise`的一些实用静态方法

1. `Promise.all()`方法传入一个由`Promise`对象组成的数组，这个方法当所有的`Promsie`都返回`resolve`时，该方法返回`resolve`，有任何一个返回`reject`，方法返回`reject`。

2. `Promise.race()`方法传入一个由`Promise`对象组成的数组，这个方法返回第一个返回`resolve`的`Promise`的结果。

   ```javascript
   let p1 = Promise.resolve(42);
   let p2 = Promise.resolve('Hello World');
   let p3 = Promise.reject("Oops");
   
   Promise.race([p1, p2, p3])
   .then(msg => {
     console.log(msg);//42
   })
   Promise.all([p1, p2, p3])
   .catch(err => {
     console.error(err);//"Oops"
   })
   Promise.all([p2, p3])
   .then(msg => {
     console.log(msg);//[42, 'Hello world']
   })
   ```

#### `Promise`的局限

1. **单决议**：

   一个`Promise`对象只能被决议一次，也就是一旦确定是`resolve`或者是`reject`，其不能再修改。**这样在要多次复用异步任务的情况下，我们必须每次都返回一个新的`Promsie`，才能够达到复用的效果。**

2. **兼容**：

   很多目前的异步操作没有封装为`Promise`，必须自己手动封装。

3. **无法取消**：

   一旦你定义好了`Promise`及其回调链，你无法终止。

4. **性能**：

   相比于传统的回调函数，`Promise`做了更多的事情，自然也会稍微慢一点。

### 四、ES6生成器

#### `Generator`简介

一段最基础的`Generator`代码：

```javascript
function* Hello() {
    yield 100
    yield (function () {return 200})()
    return 300
}

let h = Hello()
console.log(typeof h)  // object

console.log(h.next())  // { value: 100, done: false }
console.log(h.next())  // { value: 200, done: false }
console.log(h.next())  // { value: 300, done: true }
console.log(h.next())  // { value: undefined, done: true }
```

分析上面的代码的执行流程：

1. 定义一个`Generator`时，需要使用`function*`，其他的和定义函数相同。上述代码中`let h = Hello()`生成了一个`Generator`，我们验证其类型，发现其不是一个传统的函数。
2. 在执行`Hello()`之后，`Hello`的内部代码，不会立即执行，而是出于一个**暂停的状态**。
3. 再遇到第一个`h.next()`时，会激活暂定的状态，继续执行代码，**当遇到第一个`yield`时，返回其后的值，回归暂停状态。**故第一次返回的值为`{value: 100, done: false}`，**前者表示返回的值，后者表示目前`Generator`处于暂停状态**。
4. 接下来调用`h.next()`，激活暂停状态，继续执行代码，遇到第二个`yield`，返回对应值与状态，之后回归暂停。
5. 如此以往，当第3次调用`h.next()`，遇到`return`语句，预示着执行即将结束，返回对象`done`属性为`true`标志着`Generator`执行结束，无法继续往下执行了。
6. 如果再次调用`h.next()`，返回的值为`{value: undefines, done: true}`。

实际上，上面仅仅是一个最简单的`Generator`，其学习成本很高，但是非常的实用。我们通过上面的例子，至少要弄清一下几点：

1. `Generator`不是函数。
2. `Hello()`不会立即执行，而是一开始处于暂停状态。
3. 每次`h.next()`都会打破暂停的状态，直到遇到下一个`yield`抑或是`return`。
4. 每次遇到`yield`时，会执行其后的表达式，并返回值，然后再次暂停。
5. 遇到`return`时，会返回值，并且结束执行，即状态变为`true`。
6. 每次执行`h.next()`的返回值都是`{value: ..., done: ...}`。

#### `Generator`如何处理异步操作

我们先看一个传统的`Promise`一次读取多个文件的代码，使用链式操作：

```javascript
//我们预先封装了一个readFilePromise，读取成功，调用resolve方法
readFilePromise('some1.json').then(data => {
    console.log(data)  // 打印第 1 个文件内容
    return readFilePromise('some2.json')
}).then(data => {
    console.log(data)  // 打印第 2 个文件内容
    return readFilePromise('some3.json')
}).then(data => {
    console.log(data)  // 打印第 3 个文件内容
    return readFilePromise('some4.json')
}).then(data=> {
    console.log(data)  // 打印第 4 个文件内容
})
```

如果我们采用`Generator`的方式，读取多个文件，那么形式会简单很多，如下：

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFilePromise('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
    const r3 = yield readFilePromise('some3.json')
    console.log(r3)  // 打印第 3 个文件内容
    const r4 = yield readFilePromise('some4.json')
    console.log(r4)  // 打印第 4 个文件内容
})
```

`co()`函数是一个第三方库引入的函数，他的作用就是帮我们自动的执行`Generator`。

注意这里的`Promise`回调逻辑哪里去了？实际上，回调逻辑被一种巧妙的方式转移到了与`Promise`同级的代码块中，上例就是对应的打印语句。

可以理解为，`co()`函数，自动的对`Generator`的执行以及`Promise`进行了2次封装。实际上`yield`后面不仅可以是一个`Promise`也可以是一个`Thunk`函数，具体的封装流程可以参看这篇文章[Generator 函数的异步应用](https://es6.ruanyifeng.com/#docs/generator-async)。

#### 错误处理

`Generator`可以通过定义`throw()`函数抛出错误，这样我们可以通过`try...catch`语句捕获到错误。

<u>有关于`Promise`的`reject`状态，`co()`函数也已经封装完备。</u>

#### `Generator`与回调的关系

实际上，两者从本质上没有关联。但是，`Generator`的精髓在于**暂停**，而异步操作实际上也是类似于“开始读取文件，然后**暂停**等待文件读完，然后继续后面的操作”。这两者就很容易被联系到一起。

**`Promise`离不开回调，他是利用了回调来实现的。实际上`Generator`模式处理异步，也同样离不开回调，只不过，这种模式做了进一步的封装，让使用者感觉不到回调，形式上更像是一种同步代码，而在做异步的工作。**

这里指的`Generator`模式是指通过`co()`函数自动化执行`Generator`。

#### `Generator`的局限

1. 需要借助`co()`函数，或者自己封装自动执行函数，对开发者要求高。
2. `Generator`学习成本高。

### 五、终极解决方案：ES7的`async-await`

`async-await`实际上，是`Generator`的一种语法糖，是对其的再次改造与封装。`Generator`模式尚且需要`co()`函数的辅助，`async-await`直接一步到位。

两者对比：

```javascript
//Generator模式
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    console.log(r1)  // 打印第 1 个文件内容
    const r2 = yield readFilePromise('some2.json')
    console.log(r2)  // 打印第 2 个文件内容
})
//async-await
// 定义 async 函数
const readFileAsync = async function () {
    const f1 = await readFilePromise('data1.json')
    const f2 = await readFilePromise('data2.json')
    console.log('data1.json', f1.toString())
    console.log('data2.json', f2.toString())
}
// 执行
const result = readFileAsync()
```

**关键字`async`标志了一个函数，是一个异步函数，`async function`替代了`function*`，同时，可以看出`await`替代`yield`。同时，也不再需要`co()`函数，我们可以像执行一个正常函数一样，执行这个异步函数。**

#### `async-await`的不同与优点

1. `await`后面只能跟一个`Promise`对象，不能再跟`Thunk`函数，当然也可以跟其他的数据类型，这样这一段代码就会变成一个同步执行的代码。
2. 执行这个异步函数返回的是一个`Promise`对象，我们可以继续对它调用`then()`方法或者`catch()`方法。**所以实际上`Promise`才是异步操作的终极解决方案。**
3. `async-await`的书写方式非常易读，感官上更像是同步代码，适合开发者理解。

#### `async-await`与回调的关系

它从`Generator`与`Promise`中封装提取出来，跟回调的关系就是后两者跟回调的关系。

### 六、总结

这里来总结感受一下，异步操作从一开始的回调函数的方式，到如今`async-await`模式的变化：

#### `callback`方式：

```javascript
fs.readFile('some1.json', (err, data) => {
    fs.readFile('some2.json', (err, data) => {
        fs.readFile('some3.json', (err, data) => {
            fs.readFile('some4.json', (err, data) => {
							//do something
            })
        })
    })
})
```

#### `Promise`方式：

```javascript
readFilePromise('some1.json').then(data => {
    return readFilePromise('some2.json')
}).then(data => {
    return readFilePromise('some3.json')
}).then(data => {
    return readFilePromise('some4.json')
})
```

#### `Generator`方式：

```javascript
co(function* () {
    const r1 = yield readFilePromise('some1.json')
    const r2 = yield readFilePromise('some2.json')
    const r3 = yield readFilePromise('some3.json')
    const r4 = yield readFilePromise('some4.json')
})
```

#### `async-await`方式：

```javascript
const readFileAsync = async function () {
    const f1 = await readFilePromise('data1.json')
    const f2 = await readFilePromise('data2.json')
    const f3 = await readFilePromise('data3.json')
    const f4 = await readFilePromise('data4.json')
}
```

**可见整个异步操作方法的发展史，就是探索如何将异步代码“同步化”的过程。**

### 参考

1. [深入理解`JavaScript`异步](https://github.com/wangfupeng1988/js-async-tutorial)
2. [`JS`基础之异步](https://juejin.im/post/5a8fe8a05188255efc5f6c94)

3. [`JavaScript`异步编程](https://segmentfault.com/a/1190000015711829)
4. [`Generator`函数的异步应用](https://es6.ruanyifeng.com/#docs/generator-async)

