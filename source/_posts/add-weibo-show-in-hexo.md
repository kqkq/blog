title: 在Hexo博客中添加微博秀
date: 2014-03-22 12:23:40
tags:
categories: 工巧匠心
---

在博客上添加一个微博秀是件挺酷的事情，但作为一名前端小白，这事儿着实让我折腾了一阵。下面所有操作以默认的landscape主题为例。

首先，我们要登录[新浪微博开放平台](http://app.weibo.com/tool/weiboshow)来获取微博秀的代码。然后新建`themes/landscape/layout/_widget/weibo.ejs`这个文件，将刚刚获取到的代码添加到这个文件中。最后编辑`themes/landscape/_config.yml`，在`widgets:`标签后面的适当位置添加`- weibo`。这样微博秀应该就可以显示在你的博客上了。

如果显示区域空白，有可能是因为你使用`localhost`访问导致的。使用本地IP地址`127.0.0.1`来访问就没问题了。

正常情况下，这篇文章就应该结束了，但对于一个强迫症患者来说，这篇文章才刚刚开始……

<!--more-->

上述方法添加的微博秀没有标题文字，也不像landscape的其他widget那样具有圆角矩形、带内阴影的边框，使得这个组件与整个的博客主题格格不入。那要如何才能让微博秀更“和谐”呢？

首先，获取微博代码时就要进行一些设置，为了将微博秀“嵌入”到widget中，我们要关掉各种边框和标题栏。更重要的是，我们要将微博秀的背景色设置成与主题一致的`#dddddd`。我还顺便调整了一下其他的配色，使其更适合灰色的背景。调整后的配色和模块设置如下图：

![][weibo-code]

获取到的代码如下：

``` html
<iframe width="100%" height="550" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=1&ptype=1&speed=0&skin=2&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=1839031723&verifier=2dad15cd&colors=dddddd,dddddd,4473924,0069a4,dddddd&dpc=1"></iframe>
```

下面我们就给微博秀加上标题和圆角矩形的边框，我们可以仿照其他widget的代码，来调用现有的风格。下面代码以landscape主题为例，其他主题的设置方法也类似，可以挑一个主题自带的简单的widget，将其改为`weibo.ejs`。例如我就从`archive.ejs`下手，其代码如下：

``` html
<% if (site.posts.length){ %>
  <div class="widget-wrap">
    <h3 class="widget-title">Archives</h3>
    <div class="widget">
      <%- list_archives() %>
    </div>
  </div>
<% } %>
```

我将它复制了一份，改为`weibo.ejs`。然后删掉`if`语句，将`<iframe>`代码放到恰当位置，修改标题为“Weibo show”。根据`archive.ejs`修改的`weibo.ejs`如下：

``` html
<% if (true){ %>
  <div class="widget-wrap">
    <h3 class="widget-title">Weibo show</h3>
    <div class="widget">
      <iframe width="100%" height="500" class="share_self" frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=1&ptype=1&speed=0&skin=2&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=1839031723&verifier=2dad15cd&colors=dddddd,dddddd,4473924,0069a4,dddddd&dpc=1"></iframe>
    </div>
  </div>
<% } %>
```

重新生成博客，你就会发现微博秀的外面也具有了像其他默认widget一样的圆角矩形边框。但是还有一个小问题，那就是这个外框带有一个`padding`值，使得微博秀显示在其中小了一圈，我们希望将微博秀贴边显示。这个padding值正是由`widget`这个class的CSS设定的。我们要根据原有的widget的CSS来建立一个适合于微博秀的CSS class。

编辑`themes/landscape/source/css/_partial/sidebar.styl`，将其中原有的`.widget`的前半部分复制一份，放到文件的最后，重新起一个名字，然后将`padding`一行删掉。即在`sidebar.styl`文件的最后添加如下代码：

``` css
.widget-weibo
  color: color-sidebar-text
  text-shadow: 0 1px #fff
  background: color-widget-background
  box-shadow: 0 -1px 4px color-widget-border inset
  border: 1px solid color-widget-border
  border-radius: 3px
```

然后将`weibo.ejs`中原来的`widget`改成上面刚创建的`widget-weibo`。修改后的代码如下：

``` html
<% if (true){ %>
  <div class="widget-wrap">
    <h3 class="widget-title">Weibo show</h3>
    <div class="widget-weibo">
      <iframe width="100%" height="500" class="share_self" frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=1&ptype=1&speed=0&skin=2&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=1839031723&verifier=2dad15cd&colors=dddddd,dddddd,4473924,0069a4,dddddd&dpc=1"></iframe>
    </div>
  </div>
<% } %>
```

再次生成博客页面，你会发现一切都和谐了！

[weibo-code]: /images/weibo-show-1.png