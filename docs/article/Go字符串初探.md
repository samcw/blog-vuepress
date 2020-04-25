---
title: Go字符串初探
category: Go
description: 最近在学习Go，旨在通过学习一门静态类型的语言，来弥补自己的一些知识上的疏漏。Go的字符串着实困扰到了我，涉及到了大量有关类型以及编码的知识，在这篇博文，将围绕这个内容做一个总结。
date: 2020-04-15
---

这篇博文的知识，主要是阅读了`Go`的官方博客在2013年发表的一篇，名为[《Strings, bytes, runes and characters in Go》](https://blog.golang.org/strings)的文章，里面解释了`Go`语言中的`string`、`byte`以及`rune`类型以及`Go`中的编码方式等内容。

### 相关概念的辨析

1. **字符串、字符、字节、位**：
   1. 位`bit`：`bit`是计算机中最小的存储单位，一个`bit`表示一个二进制位，存储`0`或`1`。
   2. 字节`byte`：一个`byte`由8个`bit`组成。在`Go`中，`byte`也是一种类型，其底层实际上是一种`uint8`类型的别名，主要是为了区分字节类型和`uint8`类型，可以指代一个`ASCII`的字符。
   3. 字符：字符表示一个可以正常显示的一个符号，譬如一个字符串`abc`，其中`a`、`b`、`c`都是字符，在`Go`中，一个字符对应一个`rune`类型值。
   4. 字符串`string`：**`Go`中的字符串，实际上是只读的字节切片。**
2. **`Unicode`码点**：实际上，字符的概念非常难以定义，在`Unicode`标准中，使用码点来代指，一个`Unicode`表示的个体。其表示是码点，其值是一串数字。
3. **`rune`类型**：其是`Go`中，用以表示一个**字符**的类型，是`int32`类型的别名，为了区别表示字符类型以及`int32`类型。

### 字符串是字节的切片

我们都知道，在`Go`当中，字符串是字节的切片。跟`JavaScipt`有非常大的不同，主要体现在下面这个例子当中：

```go
func test() {
  s := "Hello,世界"
  fmt.Println(len(s))
}
```

这个函数的输出是`12`，按照直觉来讲，输出应该是`8`才对。但是，正因为字符串是字节的切片，故取字符串`Hello,世界`，实际上是在取其对应的字节切片的长度。而在`Go`中是采用`utf-8`编码，一个汉字对应着3个字节，因此才得到了`12`这个数字。

为了验证这个说法，我们取其对应字节的输出：

```go
func test() {
  s := "Hello,世界"
  for i := 0; i < len(s); i++ {
    fmt.Printf("% x", s[i])
  }
}
```

输出为，12个字节：

```shell
48 65 6c 6c 6f 2c e4 b8 96 e7 95 8c
```

### `Unicode`与`utf-8`

我们知道，`Go`中，都是采用`utf-8`来对`Unicode`进行编码的，这种编码方式有着动态大小的特点，借用`Go`语言圣经中的一张图来解释：![https://tva1.sinaimg.cn/large/007S8ZIlly1gduq3idaoej30zu0643ze.jpg](https://tva1.sinaimg.cn/large/007S8ZIlly1gduq3idaoej30zu0643ze.jpg)

表示不同范围`Unicode`值，编码采用了不同个数的字节，我们常用的汉字，就一般是使用3个字节去表示的。

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gduq81c91lj30hu0sumxo.jpg" alt="https://tva1.sinaimg.cn/large/007S8ZIlly1gduq81c91lj30hu0sumxo.jpg" style="zoom:30%;" />

上面这个例子展示了字符`你`，是如何编码和解码的。其用`Unicode`表示，为2个字节，编码为`utf-8`则为3个字节。

### `rune`类型

如果我们始终用若干字节去表示一个字符，那未免也太过繁琐。同时，我们上面知道取一个字符串长度，取得的是这个字符串对应字节的长度，那么我们用传统的`for`循环，取去的字符串中的每个字符，其结果是绝对不符合我们的期望的。

`Go`就专门为字符定义了字符类型`rune`。它是`int32`类型的别名，主要就是用来处理`Unicode`字符的。之所以，其对应的是`int32`类型，这主要是因为`utf-8`编码，最大会产生4个字节的大小的值，故对应了`int32`类型。

在`Go`中想要按照正常的方式，遍历一个字符串，可以采用使用`for range`的形式，来对一字符串遍历：

```go
func test() {
  s := "Hello,世界"
  for _, val := range s {
    fmt.Printf("%#U\n", val)
  }
}
```

使用`for range`循环，实际上就是在字符串中对字符`rune`进行遍历。输出为：

```shell
U+0048 'H'
U+0065 'e'
U+006C 'l'
U+006C 'l'
U+006F 'o'
U+002C ','
U+4E16 '世'
U+754C '界'
```

其次，也可以使用标准库对字符串进行处理，如使用`unicode/utf8`库中的`DecodeRuneInString`方法，输入一个字节切片，返回一个`rune`值和其使用`utf-8`编码的字节宽度。

### 为什么要编码

实际上，现在`Unicode`已经收录了，超过12万个字符，我们如果直接使用一个`int32`的序列来存储所有的字符就已经足够使用，为什么还要采用`utf-8`这种编码模式？

主要是因为，如果统一使用固定长度`bit`来存储所有的字符，会导致存储空间的极大浪费。我们在日常的使用中，大部分时候，都是使用到了`ASCII`可以表示的一些字符，只有少数情况下，使用的字符会超出`ASCII`的表示范围。因此，我们需要使用`utf-8`这种变长的编码工具，来为我们节约空间。

### 参考

1. [Strings,bytes,runes and characters in Go](https://blog.golang.org/strings)
2. [Go语言程序设计](https://book.douban.com/subject/27044219/)

