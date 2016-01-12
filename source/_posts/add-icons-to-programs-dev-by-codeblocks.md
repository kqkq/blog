---
title: 为用Code::Blocks写的程序添加图标
date: 2010-05-05 22:19:27
tags:
categories: 编程之美
---

使用Code::Blocks写出来的界面程序的图标是个默认的DOS图标，很想把它换成一个自己定义的图标。经过尝试，发现使用.rc资源文件可以轻松实现这点。

新建一个icon.rc资源文件，加入一行：

``` plain
MAINICON ICON "Icon_1.ico"
```

然后把Icon_1.ico拷贝到当前目录，接着把icon1.rc文件添加到项目中去，最后编译即可。
