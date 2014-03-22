title: Xcode中下载和使用离线文档
date: 2012-01-29 00:16:08
tags:
categories: 果粉手札
---

本文介绍如何使用下载工具高速下载苹果的开发文档并手动安装到Xcode中。

1. 在Xcode的Preference菜单中选Downloads-Documentation，点击希望下载的文档，点左下角的上箭头图标，展开该项目的详细信息。
2. 在详细信息中找到Feed地址，用Safari浏览器访问该地址，例如iOS 5的文档<http://developer.apple.com/rss/com.apple.adc.documentation.AppleiPhone5_0.atom>
3. 在打开的网页中会发现一个xar文件的下载链接，就是它了！用下载工具下载它
4. 将下载到的xar文件放到`/Developer/Documentations/Docset`目录下，在终端中执行如下命令

``` bash
cd /Developer/Documentation/Docsets
sudo xar -xf 下载的文件名.xar
sudo chown -R -P devdocs 解压后的文件名.docset
```

在Xcode中就可以使用啦~~
