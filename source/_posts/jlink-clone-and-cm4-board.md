---
title: 山寨J-Link V8仿真器与Cortex-M4开发板之不得不吐的槽 
date: 2012-05-16 13:22:23
tags:
categories: 软硬兼施
toc: true
---

## 下载J-link仿真器驱动

上了SEGGER的官方网站，找到了下载驱动的地方，点了让我输入序列号，我看仿真器的背面，没序列号啊~我只好点下面的一个我没序列号的链接，点进去它问你为啥没序列号，其中包括板载仿真器、OEM产品等等，我也不知道我为啥没序列号，只好点了一个其他原因。。。然后它让我保证，不将软件和仿真器用于非法用途，好吧，我保证。。。

下面的一幕我震惊了——网站上出现了十几张仿真器的图片，我以为是让你选自己是哪一款，我一眼就看到了我的那款，鼠标点了没反应，只好仔细看英文提示，结果人家说——这里是一个山寨仿真器大全，如果您使用的是以下这些图片中的仿真器，那基本可以确定你那个是山寨的。这些山寨仿真器基本都是在中国和俄罗斯制造的。如果你不确定你的是不是山寨，请联系XXXXX。。。。

<!--more-->

我去！原来这些奇形怪状的东西都是山寨的，，，下面让我保证不将下载的软件用于这些山寨的仿真器。。。好吧，假设我的不是山寨的，我保证还不行么。。。终于，，，驱动下载下来了。。。

## 连接J-link到目标板

老师的板子居然没有留标准的JTAG接口，而是自己设计了个排针。。。更奇葩的是，那个排针是2.0mm的，不是常见的2.54mm的。。。于是我的杜邦线插不上去，得到授权后，我非常暴力的把线焊到了排针的焊盘上，又自己做了一组2.54的20pin接口，跟仿真器连起来了。

连起来后，在电脑上居然提示参考电压不足。。。一测JTAG口的参考电压端，确实只有0.1V，看来硬件有问题。只好打电话给肖工，人家第一句话就是：你不会把电源接反了吧！

我去也太小看我了。。。接反电源应该是我小学时干的事情，现在不至于这么二。。。在肖工的指导下，我对照着供电的电路图，一路查回去，LDO输出3.3V，没电压，再查输入的5V，好像只有2V，再查电容……诡异的地方出现了，在一条线上的两个焊盘电源居然不一样！！再查，发现热保护管的一个引脚脱焊了。。。。。。更牛逼的是，当我用万用表的表笔测这个点时，恰好将脱焊的引脚压回了焊盘上，参数都是正常的，表笔抬起来时，那个引脚又离开焊盘一点点，于是另外一个点的电压又不正常了。。。那里有一坨焊锡，脱焊的引脚上也是，白茫茫一片，实在是很难发现。。。这种bug该如何吐槽！！

## J-link固件

装好驱动插上仿真器，直接就提醒我更新固件。我这种追新的人，怎么可能用旧版的固件！直接点了更新，还真是给力，不到半分钟就自动完成了刷固件的过程，然后仿真器就重启了，，，然后就没有然后了。。。

网上查了一下，貌似是因为驱动版本太高了，发现了我山寨的本质，于是就罢工了。。。于是去下载了号称稳定版的4.08驱动，手头还有另一个没刷固件的仿真器，这就开始了漫长的尝试过程

* 驱动：
	* 4.46f
	* 4.08i
* 固件：
	* 仿真器自带的固件（2010年编译）
	* 最新的固件（2012年编译）
	* 从网上下载的固件（2009年编译）

驱动配固件，这一共有6种组合，每种组合还有J-link和RDI两种调试方法，还分JTAG和SWD两种接口。所以一共是这么二十多种组合吧，我基本全都试了一遍。有的根本找不到仿真器，有的没法启动调试，有的貌似对了但其实程序根本没刷进去。。。总之，旧版的驱动不认M4芯片，于是只能用新版，但新版的驱动会发现我是山寨的，于是固件要用旧版，于是就囧了。。。只有一种组合可以把程序刷进去并且运行，那就是4.46f驱动，2010年的旧固件，J-link调试，用SWD接口。。。。。。还有，IAR环境要用6.3最新版的。。。否则不支持M4芯片。。。就因为IAR的版本太低，我浪费了大概4个多小时。。。

但这种样也不太行，芯片被不停的复位，终于受不了了，放弃了。。。

今天直接杀到老师的公司，求肖工指导。肖工断定我仿真器的线接错了，我说不可能！肖工也太小看我了，上次说我接反电源的事情我还耿耿于怀呢。。。一共8根线，我照着官方的文档接的，这都能错我还用混吗！！我一直坚持我的仿真器有问题，让他替换一下。果然不出所料，他也没法用我的仿真器。。。

于是他点了自动提示的固件升级，我心想这下完蛋了，没有2010固件的仿真器了，情何以堪。升级完固件，居然好了！我擦~难道之前一直不行是因为仿真器固件太低了？瞄了一眼肖工的驱动版本，是4.36f，比我4.46f要稍低一些。拿着刷好固件的仿真器到自己的电脑上一试，果然好了，固件的编译日期是2011年的。

难道我纠结了2天的问题，就是因为固件版本错误？后来我觉得，那个固件应该不是从网上自动下载的，而是随着J-link驱动而安装的。4.36f驱动带的2011年固件是比较合适的，4.36f驱动也能认出M4芯片

## 千金易得，开发板难求

人家又让把板子留下了。。。怒了，决定自己做一块。。。
