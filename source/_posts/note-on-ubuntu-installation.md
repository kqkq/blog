title: 实验室电脑装Ubuntu手记
date: 2012-10-31 17:32:05
tags:
categories: 工巧匠心
---

自认为是*nix用户，不过从来没在自己的PC上装Ubuntu，终于有自己的机位了，装了一个Ubuntu Desktop 12.10

把遇到的一些问题记录一下

1. `apt-get`不能用  
不管是`install`还是`update`，任何命令都报错

	```bash
	E: Encountered a section with no Package: header
	E: Problem with MergeList /var/lib/apt/lists/security.debian.org_dists_squeeze_updates_contrib_i18n_Translation-en
	E: The package lists or status file could not be parsed or opened.
	```

	解决方法是删掉之前坑爹的缓存

	```
	rm -rf /var/lib/apt/lists/*
	```
<!--more-->

2. 改主机名  
安装时偷懒，没改一个喜欢的主机名，等装好了再改就要费一点周折
首先要编辑`/etc/hostname`。这还不够，还要编辑`/etc/hosts`

3. 安装L2TP VPN插件  

	```bash
	Installation:
	sudo apt-add-repository ppa:seriy-pr/network-manager-l2tp
	sudo apt-get update
	sudo apt-get install network-manager-l2tp-gnome
	!!!!!!!!!!!!!!!!!!
	sudo service xl2tpd stop
	sudo update-rc.d xl2tpd disable
	!!!!!!!!!!!!!!!!!!
	```

	Ubuntu默认只带了PPTP VPN的软件，我的VPN是L2TP的，有这么个插件，可以装一下。装完后添加VPN的地方就会多一个L2TP的选项，可以把配置加进去，不过还是不能用。按照官网的说法，装完后执行斜体部分，就可以用了。不过我试了，不管用，后来重启了一下就好了~

4. 输入法相关  
使用了iBus框架下的Sunpinyin。iBus开机启动的方法是：在Language Support中，将输入法选为ibus。另外sunpinyin弹出设置界面居然必须敲命令。。。太囧了。。。

	```bash
	/usr/lib/ibus-sunpinyin/ibus-setup-sunpinyin
	```

5. 挂在ISO文件  
双击挂载居然不支持大文件，使用命令行

	```bash
	sudo mount -o loop XXXX.iso /cdrom
	```