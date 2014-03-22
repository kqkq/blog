title: Mac下vim编辑器最简单配置方法(开启语法高亮)
date: 2012-01-23 21:32:54
tags:
categories: 果粉手札
---

首先执行

```
cp /usr/share/vim/vimrc ~/.vimrc
```

拷贝默认的配置文件

然后再执行

```
vim ~/.vimrc
```

编辑该文件，在文件的最后加入`syntax on`，保存退出即可。