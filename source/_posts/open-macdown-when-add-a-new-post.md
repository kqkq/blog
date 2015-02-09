title: 在为Hexo博客添加文章时自动打开编辑器
date: 2015-02-09 15:25:42
tags:
categories: 工巧匠心
---

为Hexo添加博客时需要在终端输入命令`hexo new post "Post title"`，输入之后需要手动定位到`source/_posts`中的相关文件，这个目录比较深，定位比较麻烦，而`_posts`目录下可能有上百个文件，找到刚刚添加的那个也得费点劲，如果能在键入新建文章的命令之后能自动打开刚刚新建的文件，那样就方便多了。

GitHub上也有人也提出了[同样的想法](https://github.com/hexojs/hexo/issues/1007)，Hexo的作者给出了一个解决方法，就是在Hexo博客的根目录下的`scripts`目录中新建一个JavaScript脚本（如果没有`scripts`目录则手动创建一个），在其中捕获`new`事件。

<!--more-->

我最喜欢的Markdown编辑器是MacDown，于是我在`scripts`目录下建立了一个名为`macdown.js`的文件，这个文件名可以随意起，内容如下：

```js
var exec = require('child_process').exec;hexo.on('new', function(target){        exec('open -a MacDown ' + target);        });
```

下面来测试一下~我在终端中输入`hexo new post "open macdown when add a new post"`，果然MacDown蹦了出来，太酷了！于是我就在蹦出的MacDown窗口中写下了这篇文章^_^

P.S. 据说在Hexo 3中这段代码还会有所不同，详见GitHub上的Issue，我现在用的还是Hexo 2.8，等更新了之后再实验一下。