---
title: C#判断ContextMenuStrip右键菜单的来源
date: 2009-06-26 22:48:08
tags:
categories: 编程之美
---

有时候，为了提高性能和节约资源，我们会为多个控件，指定同一个右键弹出菜单，这时，通常会产生一个需求：判断当前的弹出菜单是从哪个控件上弹出来，也就是“是由哪个控件的右键点击触发的”，以便于做进一步的控制。

在.NET当中，实现起来是非常简单的，假设弹出菜单为`ContextMenuStrip1`，则只需要在 该菜单的`Opening`事件进行判断处理即可。

<!--more-->

``` cs
private void contextMenuStrip1_Opening(object sender, CancelEventArgs e)
{
    //取得来源控件的Name
    MessageBox.Show((sender as ContextMenuStrip).SourceControl.Name);
}
```
 
我的程序要在图片框上弹出右键菜单，获得当前图片框中的图像，我是这样做的：

``` cs
private void contextMenuStrip1_Opening(object sender, CancelEventArgs e)
{
    PictureBox ctlPicBox = (PictureBox)(sender as ContextMenuStrip).SourceControl;
    Bitmap imgScr1 = new Bitmap(ctlPicBox.Image);
}
```
 
要注意的是，必须在`ContextMenuStrip`的`Opening`事件中添加代码，不能添加在`Click`事件中。如果需要在`Click`中处理，就只能设置公共的全局变量喽~
