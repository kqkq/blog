title: Allegro PCB Editor与十字花焊盘有关的技巧
date: 2013-07-12 22:52:56
tags:
categories: 软硬兼施
---

花焊盘又称热焊盘、热风焊盘等。其作用是减少焊盘在焊接中向外散热，以防止因过度散热而导致的虚焊。在Allegro中，添加GND铺铜后，默认就会为相关的焊盘创建十字连接。但有时候自动添加的连接并非我们理想中的连接，我们可以对其进行细致的调节，使其满足我们的需求。

### 1. 调节十字连线宽度

默认的连线宽度是约束管理器中设置的线宽最小值，但这个最小值看起来有些单薄，但如果增大约束管理器中的最小值，又可能导致高密度的芯片地线处产生DRC错误。点击Shape - Global Dynamic Params...，在弹出的Global Dynamic Shape Parameters对话框中点击Thermal relief connects选项卡，可以通过下方的Use fixed thermal width of项目指定十字连接的宽度，或者通过Use thermal width oversize of来指定十字连接的宽度在约束管理器线宽设定值的基础上再增加多少。

<!--more-->

### 2. 调节热焊盘的连接方式或者删除热焊盘

同样在Global Dynamic Shape Parameters对话框的Thermal relief connects选项卡中，Thru pins、Smd pins、Vias三项可以分别设定通孔焊盘、表贴焊盘和过孔的热焊盘连接方式，设定为Full contact即为直接连接，不添加热焊盘。

### 3. 设置特定焊盘的热焊盘参数

有时候为了可靠接地，我们可能需要设置特定的几个焊盘的接地方式，这在射频电路中可能会遇到，比如天线的接地等。设置的方法是选中指定的焊盘（Find调板中仅选中Pins然后点击需要设置的焊盘或者框选需要设置的连续多个焊盘），然后点击右键，在菜单中点Property edit，在弹出的对话框中添加相应的属性，即可为该焊盘单独指定热焊盘参数。
比如
DYN_FIXED_THERM_WIDTH  连接线宽
DYN_THERMAL_CON_TYPE  连接类型

### 4. 为指定的一片铺铜设置特定的热焊盘参数

通过Shape - Select Shape or Void/Cavity命令来选择需要设定的铺铜Shape，然后点击右键，选择Parameters，弹出的Dynamic Shape Instance Parameters对话框与上述全局设置对话栏类似，指定相应参数即可。
