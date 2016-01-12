---
title: Mac OS X通过SSH连接Linux服务器时中文出现乱码的解决方法
date: 2012-12-06 00:46:20
tags:
categories: 果粉手札
---

这个问题跟Mac的终端程序有关。修正方法是：

编辑Mac系统下`/etc/ssh_config`这个文件，将其中`SendEnv LANG LC_*`这一行前面加一个井号，注释掉，保存退出

再使用ssh连接远程Linux服务器时，中文就不会有问题了~
