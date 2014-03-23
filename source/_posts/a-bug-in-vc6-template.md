title: Visual C++ 6.0友元函数模板需要注意的Bug
date: 2010-10-03 02:39:31
tags:
categories: 编程之美
---

晕，一个破链表程序还要面向对象，搞到半夜，一会是编译错误一会是链接错误错误。

按照C++国际标准，重载的友元函数声明(以流操作符为例)必须写成这样：

``` cpp
friend ostream& operator << <T>(ostream &, const List<T> &);
```

按照VC6的狗屁标准必须写成这样：

``` cpp
friend ostream& operator <<(ostream &, const List<T> &);
```

否则会提示一些不知所云的错误，如下：

<!--more-->

``` plain
f:\mylist\list.h(28) : error C2143: syntax error : missing ';' before '<'
        f:\mylist\list.h(58) : see reference to class template instantiation 'List<T>' being compiled

f:\mylist\list.h(28) : error C2433: '<<' : 'friend' not permitted on data declarations
        f:\mylist\list.h(58) : see reference to class template instantiation 'List<T>' being compiled

f:\mylist\list.h(28) : error C2244: '<<' : unable to resolve function overload
        f:\mylist\list.h(58) : see reference to class template instantiation 'List<T>' being compiled

f:\mylist\list.h(28) : error C2059: syntax error : '<'
        f:\mylist\list.h(58) : see reference to class template instantiation 'List<T>' being compiled

f:\mylist\list.h(28) : error C2238: unexpected token(s) preceding ';'
        f:\mylist\list.h(58) : see reference to class template instantiation 'List<T>' being compiled

f:\mylist\list.h(28) : error C2143: syntax error : missing ';' before '<'
        f:\mylist\main.cpp(6) : see reference to class template instantiation 'List<int>' being compiled

f:\mylist\list.h(28) : error C2433: '<<' : 'friend' not permitted on data declarations
        f:\mylist\main.cpp(6) : see reference to class template instantiation 'List<int>' being compiled

f:\mylist\list.h(28) : error C2244: '<<' : unable to resolve function overload
        f:\mylist\main.cpp(6) : see reference to class template instantiation 'List<int>' being compiled

f:\mylist\list.h(28) : error C2059: syntax error : '<'
        f:\mylist\main.cpp(6) : see reference to class template instantiation 'List<int>' being compiled

f:\mylist\list.h(28) : error C2238: unexpected token(s) preceding ';'
        f:\mylist\main.cpp(6) : see reference to class template instantiation 'List<int>' being compiled

执行 cl.exe 时出错.
```

按照VC6的写法，在VC2008下会出现链接错误，同样不知所云，如下：

``` plain
错误         1       error LNK2019: 无法解析的外部符号 "class std::basic_ostream<char,struct std::char_traits<char> > & __cdecl operator<<(class std::basic_ostream<char,struct std::char_traits<char> > &,class List<int> const &)" (??6@YAAAV?$basic_ostream@DU?$char_traits@D@std@@@std@@AAV01@ABV?$List@H@@@Z)，该符号在函数 _main 中被引用         main.obj

错误         2       fatal error LNK1120: 1 个无法解析的外部命令   f:\myList\Debug\main.exe      1
```

而同样的程序在GCC下则提示的比较清楚，除了错误信息外还给出了一个Note，如下：

``` plain
F:\myList\list.h|28|warning: friend declaration 'std::ostream& operator<<(std::ostream&, const List<T>&)' declares a non-template function|

F:\myList\list.h|28|note: (if this is not what you intended, make sure the function template has already been declared and add <> after the function name here) |

obj\Debug\main.o||In function `main':|

F:\myList\main.cpp|13|undefined reference to `operator<<(std::ostream&, List<int> const&)'|

||=== Build finished: 1 errors, 1 warnings ===|
```

啊~~！为什么学校机房还全是VC6？！抓狂了。

最后再支持一下开源软件，最后的最后对微软和VC6致以最崇高的鄙视。