---
title: 无法更改文件打开方式的解决办法
date: 2014-07-08 23:49:32
tags:
categories: 工巧匠心
---

前段时间将Cadence 16.5更新到16.6之后，之前指定过打开方式的brd、pad、dra等文件无法双击打开，试图重新指定打开方式也无效。在“打开方式”窗口中点击“浏览”按钮，定位到`C:\Cadence\SPB_16.6\tools\pcb\bin\allegro.exe`之后，Allegro的图标并未出现在“打开方式”的列表中。

导致这个问题的原因是我们之前添加过`allegro.exe`，此程序的路径变更（从SPB_16.5目录变成了SPB_16.6目录）之后，就会导致“打开方式”无法添加。解决这个问题的方法是：

<!--more-->

在“运行”中输入regedit打开“注册表编辑器”，定位到`HKEY_CLASSES_ROOT\Applications`分支，在其中找到`allegro.exe`、`pad_designer.exe`等主键，将其删除。之后就可以按正常的方法指定相应文件的打开方式了。当然也可以直接修改这些键下的键值，将其改成正确的程序路径。
