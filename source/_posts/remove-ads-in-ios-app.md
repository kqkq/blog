---
title: iOS应用程序去广告方法
date: 2011-08-02 14:31:23
tags:
categories: 果粉手札
---

iOS中的不少应用程序都嵌入了广告，免费应用中尤其常见。比如一些免费游戏，还有我常用的韦氏词典……这些广告的特点是在有网络时才会出现，因此可以通过修改hosts表的方法来阻断应用下载广告。

由于需要修改设备的系统文件，所以设备必须要先越狱，然后用Cydia下载一个文件管理工具，我用的是iFile。

修改`/private/etc/`目录下的hosts文件，在末尾加上

``` plain
127.0.0.1    r.admob.com
127.0.0.1    analytics.admob.com
127.0.0.1    p.admob.com
```

再试试吧~是不是不会出现广告啦
