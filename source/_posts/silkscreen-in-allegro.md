---
title: 如何在Allegro PCB Editor中正确地添加丝印
date: 2014-05-01 00:39:55
tags:
categories: 软硬兼施
---

在Allegro PCB Editor中，很多Class和Subclass都包含了丝印层，那么要如何添加和管理丝印层，又应该如何正确地生成丝印层的光绘文件呢？我们常用的丝印层位于下列Class/Subclass当中。

## Board Geometry - Silkscreen

板级的丝印层，一般用于添加板子上的说明性文字标注、版权信息、产品或公司Logo等等。

## Package Geometry - Silkscreen

器件级的丝印层，用于器件本身的标注，比如标注集成电路的1号引脚、标注电解电容和二极管的极性等等。这些丝印信息一般情况下由器件封装自带，所以很少在PCB中手动修改，如果封装中的丝印信息有误，应该直接修改器件封装中的信息，这样才便于复用。

<!--more-->

## Components - RefDes - Silkscreen

这个才是真正的专门用于器件的索引编号的丝印层。与坑爹的自动丝印层（Autosilk）不同，这个层的信息可以可靠地保持，调整后的索引编号不会随着元件位置的变动而变动。

## Manufacturing - Autosilk

自动丝印层，也就是由软件自动生成的丝印层。在“于博士”的Cadence教程当中，就将这个层作为了主要的丝印层。这样做可能是为了照顾初学者。这个层由软件自动生成，软件生成的丝印层非常乱，所有的索引编号都需要手动调整。然而，当你对元件以及元件周围的线路做出任何调整时，附近的丝印会重新自动生成，自己精心调整的丝印就会重新变得乱七八糟，这就使得这个层非常坑爹。

生成的内容杂乱，手动调整复杂、甚至无法可靠地保持调整后的状态。这个层在实际生产中显然没有什么实用价值，因此**不推荐使用**。

-------------

下面来讨论一下丝印的光绘文件中都应该包含哪些层。想必经过上述描述，思路已经比较清晰了。实际PCB上的丝印其实可以分成三大类：

1. 板上的说明性文字、Logo、版权信息等
2. 辅助元件安装的正负极标志、光学定位点、1号引脚标记等
3. 元器件的索引编号

另外，为了方便在制造时审阅丝印文件，有时也将板框加入到丝印层中。综上，在生成丝印的光绘文件时，推荐使用下列组合

* Board Geometry
	* Silkscreen_Top/Silkscreen_Bottom
	* Outline(可选)
* Package Geometry
	* Silkscreen_Top/Silkscreen_Bottom
* Components
	* RefDes
		* Silkscreen_Top/Silkscreen_Bottom
