---
title: 中国天气网的中央气象台实时数据接口
date: 2012-02-13 23:13:53
tags:
categories: 编程之美
---

iPhone上的天气预报用的是Yahoo!数据，实在是闹不住，本想写个中央气象台数据的天气应用，结果发现App Store上有一些做的非常好的，于是这个计划就搁浅了。。。不过还是研究了一下中国气象网的接口，这里做个笔记吧~

<!--more-->

## 1. XML接口

<http://flash.weather.com.cn/wmaps/xml/china.xml>

这个是全国天气的根节点，列出所有的省，其中的`pyName`字段是各个省XML的文件名，比如北京的是`beijing`，那就意味着北京的XML地址为

<http://flash.weather.com.cn/wmaps/xml/beijing.xml>

一个省的天气，其中列出该省各个市的数据，北京就列出各个区。

`tmp1`是最低温低，`tmp2`是最高温度，`url`非常重要，我们一会儿再说。`state1`和`state2`是神马转神马，每个数代表一个天气现象。天气现象非常多，我本想全部分析出来，后来直接放弃了这个想法。因为我看到了一个城市的天气现象的编码是26...我现在知道的有0.晴 1.多云 2.阴 6.雨夹雪 7.小雨 8.中雨 13.阵雪 14.小雪

其中后来发现知道这个没用，这个数字的主要作用是检索图片的！！！

## 2. 图片接口

* <http://m.weather.com.cn/img/c0.gif>
* <http://m.weather.com.cn/img/b0.gif>
* <http://www.weather.com.cn/m/i/weatherpic/29x20/d0.gif>
* <http://www.weather.com.cn/m2/i/icon_weather/29x20/n00.gif>

这个图就是天气现象0（晴）的图片，其他天气现象的图片依此类推。c打头的图片是20\*20像素的，b打头的是50\*46像素的，d打头的是反白的图标，29\*20像素，n打头的是夜间反白图标，29\*20像素，注意这里的文件名是两位数字！
也许还有更多的图标，等待大家发掘啦~

## 3. JSON接口

真没想到，居然有JSON接口~JSON在iPhone上分析起来要比XML简单很多。

<http://m.weather.com.cn/data/101010200.html>这个是北京的JSON数据，那个HTML的名字是根据上文XML中的url得到的。这个JSON中包含了实时数据、7天天气预报、气象指数等丰富的数据。
