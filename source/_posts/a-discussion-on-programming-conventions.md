---
title: 对编程语言中变量命名和代码缩进规范的讨论
date: 2010-03-19 23:14:53
tags:
categories: 编程之美
toc: true
---

风格优美的程序，读起来就像读一篇流畅的文章。清晰易懂又给人以美感。

看着教材和例程中糟糕的编码风格，再看着同学发来的，模仿那些的拙劣的编码。我决定写出这篇文章，谈一谈我对编程规范的拙见。

## 关于变量命名

这个问题是本文准备讨论的重点。先来总结一下变量命名的几大常用方法。

<!--more-->

### 匈牙利命名法

匈牙利命名法的特点是前缀。用前缀标明变量的类型。前缀后面的单词首字母大写，其他字母小写。让人一看到变量名就能知道这个变量的类型。对于类中的成员，在最前面附加使用“m_”前缀，意为member。全局变量添加“g_”前缀，意为global。匈牙利命名法出现时间较早。当时的编译器对类型检查的能力还比较弱。在现代的编译器中，编译器可以发现类型错误并给出详尽而准确的提示信息。而且匈牙利命名法书写复杂，因此逐渐退出了历史舞台。现在程序员使用匈牙利命名法的已经很少了。就连微软自己了.Net类库也放弃了这种命名法。在微软的技术文档中明确指出，不推荐在.Net程序中使用匈牙利命名法，而推荐使用下面的Camel命名法和Pascal命名法。

但在日常程序设计中，恰当的使用匈牙利命名法也可以带来方便。例如为控件的名称使用匈牙利命名法，就可以提高代码的可读性。例如保存按钮的名字`btnSave`，密码输入框的名字`txtPassword`，图片框`imgLogo`等等。

匈牙利命名法常用的前缀有：

* `int`，整形，如`intAge`
* `lng`，长整型，如`lngPhoneNum`
* `bln`，布尔型，如`blnEmpty`
* `chr`，字符型，如`chrChoice`
* `str`，字符串型，如`strName`

这些前缀还可以再简化，形成下面的样子（摘自维基百科）：

* `lAccountNum`：变量是一个长整型 ("l");
* `arru8NumberList`：变量是一个无符号8位整型数组 ("arru8");
* `szName`：变量是一个零结束字符串 ("sz")
* `hwndFoo`：窗口句柄
* `lpszBar`：指向零结束字符串的长指针

### Camel命名法

Camel也叫驼峰命名法。顾名思义，就是开头单词小写，后面单词首字母大写。这样两边低中间高，看起来像驼峰，因此得名。如果标识符只有一个单词，就全部使用小写。Camel命名法不添加表示类型的前缀。在Java的官方标准中，Camel命名法被作为主要命名法。Java的所有库函数均采用Camel命名法。在.Net的技术标准中，推荐对变量使用Camel命名法，而对方法名和类名使用下面的Pascal命名法。

Camel命名法的举例：

* `getName`：返回姓名的函数
* `setAge`：设置年龄的函数

### Pascal命名法

Pascal命名法也是一种受欢迎的命名法。.Net全部类库的函数名均采用Pascal命名法。Pascal命名法与Camel命名法类似，区别在于其首字母大写。例如`GetDate`，`Name`等等。

## 变量命名的常见问题

命名法主要侧重的还是大小写的规范。其实更重要的是标识符本身。使用有意义的名字作为标识符，这是地球人都知道的真理。但是有意义是什么意义？怎样才算有意义？

其实可以总结为一句话，使用英文或常用的英文缩写，不要使用汉语拼音。绝对不要使用汉语拼音的缩写。拼音缩写比用a,b,c来命名还要糟糕。

上次学校培训数据结构，师兄打开他的代码，有一个函数名是`lztz()`。我赌你一周内不可能猜出它的含义。你可以先猜一猜。不猜了？好吧我告诉你。这个是“链栈退栈”拼音的缩写。这种函数名是在是令人作呕！

一些英文的缩写是可以使用的，下面列出一些常用的英文缩写：

* `Send`可缩写为`Snd`
* `Receive`可缩写为`Rcv`
* `temp`可缩写为`Tmp`
* `flag`可缩写为`Flg`
* `statistic`可缩写为`Stat`
* `status`可缩写为`Sta`
* `message`可缩写为`Msg`

下面就来说说几个常见的问题

`Flag`，这是很多人都喜欢用的变量名。甚至还出现了`flag1`、`flag2`、`flag3`……不禁让我想起了贾君鹏你妈喊你回家吃饭，还有贾君鹏他爸，贾君鹏他姑妈……

这种`flag`虽然是英文，有意义。但并不能表达一个明确的含义。与其使用`flag`，不如使用`isEmpty`、`canExit`、`hasNext`等更明确的写法。例如这三个变量名就明确的表示（栈）空；可以退出；（输入流中）有下一个数据。相信我，`is`、`can`、`has`这三个前缀是全世界程序员都在使用的前缀，是纯正的英语。不是我编出来的Chinglish。

说到中国式英语，我不禁想到一个有趣的事情，那就是“性别”的英语。应该用`Gender`，而不是很多人，甚至很多教材上使用的`Sex`。

`GetInfo`，这个貌似是个不错的变量名。可以猜到是获取信息之意。但是仔细想想，这是废话，只要有返回值，就肯定是获取信息。其实一个`get`就够了。这样的变量可以写的再详细一点。比如获取身份信息，就是`GetID`。获取文件属性就是`GetFileProperties`等等。这样要比一个单独的`Info`有意义很多。类似的还有`GetData`设置数据，也可以用类似的方法改进。

## 关于缩进

缩进可以让程序结构清晰。对增强程序可读性有重要的意义。使用缩进时，推荐使用4个空格来缩进，缩进不要太小，至少要2个空格。使用Tab缩进很方便，但在不同编辑器里，Tab占的宽度也是不一样的。最恐怖的是空格和Tab混用。在Tab占4个字符的编辑器里一切正常，一旦到Tab占8字符的编辑器里，缩进风格就会改变。缩进相当于没有。大部分编辑器里都可以设置自动将Tab替换成4个空格，大家可以自己找找这个选项。

缩进也有不同的风格，常见的有以下几种。

### K&R风格

```
void using_k_and_r_style(){
    // K&R风格
}
```

这种风格被Java推荐采用。我个人不是很喜欢。就算写Java，我也会括号独占一行

### ANSI风格

```
void putting_each_brace_on_its_own_line()
{
    // 括号独占一行
}
```

这个风格我比较喜欢，微软也采用这种风格的缩进。使用Code::Blocks的Astyle插件以及在VC中使用`Alt+F8`（VC6）或者`Ctrl+K, Ctrl+F`（VS2005之后版本）快捷键自动整理代码格式，都会采用括号独占一行的风格。这也是C++推荐的缩进风格。

### 括号独占一行并缩进

奇怪的缩进方法，早期被广泛使用，现在我没见过有人用。前段时间看了一本“豪杰超级解霸”作者写的书，里面推荐了这种风格。我个人不喜欢这个缩进。

```
void or_putting_each_brace_on_its_own_line_indented()
   {
   // 括号独占一行并缩进
   }
```

心血来潮，写了这篇文章。草草收笔，不完善的地方就以后慢慢补充吧。欢迎大家不吝赐教。最后祝大家都能写出漂亮高效的代码。我们共同努力！
