---
title: JavaScript执行上下文
category: JavaScript
description: 在学习《JavaScript高级程序设计》的时候，在代码执行细节等方面，有许多的疑惑，书中的介绍也没能完全理解。最近在阅读冴羽老师的博客，其中的有关系列文章，对这方面做了非常nice的总结。这篇博客主要是将文中的知识点，和自己的理解做一个汇总，加深记忆。
date: 2020-04-08
---

### 作用域

1. 作用域是指程序源代码中定义变量的区域。作用域主要分为**静态作用域**以及**动态作用域**。二者的区别在于，静态作用域下，函数作用域在**函数定义的时候**就已经确定了，而动态作用域，是在函数调用的时候，才会决定的。

2. `JavaScript`采用的是所谓**词法作用域**，也就是静态作用域。这里举一个🌰：

   ```javascript
   var value = 1;
   function foo () {
     console.log(value);
   }
   function bar () {
     var value = 2;
     foo();
   }
   bar()
   //控制台打印1.
   ```

   由于`JavaScript`采用的是词法作用域，那么在函数`foo`被调用时，会先在内部查找变量`value`，再去其外层也就是全局作用域中查找`value`，发现值为`1`。

   相较于静态作用域，动态作用域语言在执行上述相似代码时，打印为`2`。

### 执行上下文栈

1. `JavaScript`中，可执行的代码主要有3种：**全局代码、函数代码以及`eval`代码**。在执行一个函数的时候，引擎会做一些“准备工作”，准备“执行上下文”。

2. 全局代码对应一个全局执行上下文，而每个函数，又有他自己的函数执行上下文。引擎用**执行上下文栈**来管理所有的执行上下文，我们使用一个数组来表示这个栈：

   ```javascript
   ECStack = [];
   ```

   如有以下代码：

   ```javascript
   function func3 () {
     consolo.log('func3');
   }
   function func2 () {
     func(3);
   }
   function func1 () {
     func2();
   }
   func1();
   ```

   分析引擎执行这段代码时，执行上下文栈的状态：

   ```javascript
   //首先全局上下文入栈
   ECStack.push(globalContext);
   //执行func1
   ECStack.push(<func1> functionContext);
   //func1调用func2
   ECStack.push(<func2> functionContext);
   //func2调用func3
   ECStack.push(<func3> functionContext);
   //func3执行完毕，其执行上下文在栈顶，出栈
   ECStack.pop()
   //func2执行上下文出栈
   ECStack.pop()
   //func1执行上下文出栈
   ECStack.pop()
   //整块代码执行完毕，全局执行上下文出栈
   ECStack.pop()
   //栈空
   ```

### 变量对象

知道什么是执行上下文，现在来说明，执行上下文里面，到底有什么。对于每个执行上下文，都有3个重要的属性：**变量对象、作用域链以及`this`**。这里先介绍变量对象。

1. 变量对象，就是一个**储存了上下文中定义的变量以及函数声明的对象**。

2. 首先，**全局执行上下文中的变量对象就是全局对象**，其非常特殊。它不但包含了许多`JavaScript`的全局函数以及全局属性，并且我们在顶层代码中，定义的所有变量以及函数都是全局对象的属性。

3. 再说函数执行上下文中的变量对象。**变量对象是在引擎层面上实现的**，我们没有办法在`JavaScript`环境中**主动的**去访问它，只有当进入到其对应的执行上下文中时，它才会被激活，这时，它变成了**活动对象(Active Object)**，活动对象的各种属性，我们才可以去访问。注意这里只是换了个说法，可以理解**活动对象就是被激活的变量对象**。

4. 活动对象是在进入函数执行上下文的时候创建的(函数的变量对象由引擎实现，活动对象是变量对象的实体表示)，由函数的`arguments`属性初始化，该属性值是`Arguments`对象。**所有的作为参数传入函数的值，都是`Aruguments`对象的数组元素。**

5. 在进入某一个执行上下文时，对于其中的代码，一般会有两个处理阶段：**分析和执行**：

   1. **分析**：在真正执行代码之前，这时变量对象会包括：

      1. **函数的所有形参**，前提是在函数执行上下文中。形参若没有赋值，则为`undefined`，所有的形参会以变量对象属性的形式，存在。
      2. **函数声明**，所有的函数声明，会以变量对象属性的形式，存在。若，此时变量对象有与其同名的属性，则**替换它**。
      3. **变量声明**，注意，变量声明也会以变量对象属性的形式存在，但是其值，此时为`undefined`。同时，如果此时有与其同名的属性，**不会进行替换**。

      这里同样举个🌰：

      ```javascript
      function foo (d) {
        var a = 2;
        function b () {};
        var c = function () {};
        a = 3;
      }
      foo(1);
      ```

      在**进入对应执行上下文之后，执行代码之前**，此时的AO为：

      ```javascript
      AO = {
        arguments: {
          0: 1,
          length: 1
        },
        d: 1,//形参
        a: undefined,//变量声明
        b: reference to function b () {},//函数声明
        c: undefined,//变量声明
      }
      ```

   2. **执行**：开始执行代码，在执行完代码之后，当前执行上下文弹出之前，AO为：

      ```javascript
      AO = {
      	arguments: {
          0: 1,
          length: 1
        },
        d: 1,
        a: 3,
        b: reference to function b () {},
        c: reference to FunctionExpress "d"
      }
      ```

6. `let`：有关于使用`let`定义变量，是否在执行函数语句前初始化的问题，一直困扰了我很久。其实，使用`let`定义的变量，**在函数执行前是会进行提升**的，但是注意，仅仅进行了提升，也就是存在于活动对象当中，但是**它并没有被初始化**。可以看下面这个🌰：

   ```javascript
   let a = 1;
   function test () {
     console.log(a);
     let a = 2;
   }
   test()
   ```

   如果不会进行提升，那么想必命令行会打印函数外层`a`的值，但事实却是打印了`ReferenceError: Cannot access 'a' before initialization`，这是一个``ReferenceError`，提示我们变量`a`还未进行初始化。

   这就表明了，变量`a`被提升了，这就使得它屏蔽外层定义的变量`a`，但是它又未被初始化，甚至值都不是`undefined`。**这就是在定义变量的语句之前，形成了一个死区，这个区域内，都无法使用这个变量。**

7. 总结：

   1. 全局上下文的变量对象初始化为**全局对象**。
   2. 函数上下文的变量对象初始化为之包含`Arguments`对象。
   3. 在进入执行栈上下文时会给变量对象添加**形参**、**函数声明**、**变量声明**等初始的属性值。
   4. 在代码执行阶段，会再次修改变量对象的属性值。
   5. `let`定义的变量，一样会被提升，但是没有初始化。

### 作用域链

执行上下文的3个重要属性分别为：**变量对象、作用域链以及`this`**，理解了变量对象之后，我们在学习一下作用域链。

1. 在当前执行上下文中，查找一个变量，会先从此上下文的变量对象中查找，如果没有找到，就会从父级(词法作用域的父级)执行上下文的变量对象中查找，就这样一直找到全局上下文的变量对象。这样的由**多个上下文的变量对象组成的链表**，就是**作用域链**。

2. 我们通过一个函数创建以及激活两个时期来解释作用域链：

   1. **函数创建**：**函数的作用域，在函数创建的时候，就已经确定了。**

      函数的有一个内部属性`[[scope]]`，当函数创建的时候，就会保存所有的父变量到其中，这个属性可以视为时所有父变量对象的层级链。

      举一个🌰：

      ```javascript
      function foo () {
        function bar () {
          //some code here
        }
      }
      ```

      函数创建时，各自的`[[scope]]`为：

      ```javascript
      //注意，这里只是作为演示，实际上，[[scope]]作为内部属性不能被直接访问
      foo.[[scope]] = [
        globalContext.VO
      ];
      bar.[[scope]] = [
        fooContext.AO,
        globalContext.VO
      ]
      ```

   2. **函数激活**：

      当进入函数的执行上下文之后，函数激活，创建了自己的活动对象，此时开始创建函数的作用域链：

      ```javascript
      Scope = [AO].concat([[scope]]);
      ```

      至此，一个作用域链，创建完毕。注意，**`[[scope]]`存储的是，所有的父级变量对象，但是，并不是完整的作用域链，因为没有包含自己的活动对象。**

3. **小总结**：

   结合执行上下文栈、变量对象以及作用域链，我们来总结一下，一个函数执行上下文中作用域链和变量对象的创建过程：

   ```javascript
   var scope = "global scope";
   function checkscope () {
     var scope2 = 'local scope';
     return scope2;
   }
   checkscope();
   ```

   执行流程如下图：

   1. `checkscope`函数被创建，保存到作用域链到内部属性`[[scope]]`：

      ```javascript
      checkscope.[[scope]] = [
      	globalContext.VO
      ];
      ```

   2. 执行`checkscope`函数，创建`checkscope`函数执行上下文，`checkscope`函数执行上下文被压入执行上下文栈：

      ```javascript
      ECStack = [
      	checkscopeContext,
        globalCOntext
      ]
      ```

   3. 执行函数之前，准备工作。第一步，创建作用域链：

      ```javascript
      checkscopeContext = {
      	Scope: checkscope.[[scope]]
      }
      ```

   4. 执行函数之前，准备工作。第二步，用`arguments`创建活动对象，加入形参、函数声明以及变量对象：

      ```javascript
      checkscopeContext = {
      	AO: {
          arguments: {
            length: 0
          },
          scope2: undefined
        },
        Scope: checkscope.[[scope]],
      }
      ```

   5. 执行函数之前，准备工作。第三步，将活动对象压入作用域链前端：

      ```javascript
      checkscopeContext = {
        AO: {
          arguments: {
            length: 0
          },
          scope2: undefined
        },
        Scope: [AO].concat(checkscope.[[scope]])
      }
      ```

   6. 准备工作齐活，开始执行函数，随着函数的执行，开始修改活动对象的属性：

      ```javascript
      checkscopeContext = {
      	AO: {
          arguments: {
            length: 0
          },
          scope2: 'local scope'
        },
        Scope: [AO].concat(checkscope.[[scope]])
      }
      ```

   7. 函数执行完毕，函数执行上下文出栈：

      ```javascript
      ECStack = [
      	globalContext
      ]
      ```

**有关`this`的内容，单独写一篇博文总结。**

### 参考

1. [冴羽老师博客仓库](https://github.com/mqyqingfeng/Blog)

