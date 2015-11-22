title: 为Hexo博客的每一篇文章自动追加版权信息
date: 2015-11-22 19:08:07
tags:
categories: 工巧匠心
---

这个需求比较简单，就是希望在每一篇博客的最后追加一段版权声明的文字。我们通过修改博客模板（themes）就可以方便地实现。但是通过修改模板的方式产生的版权信息还是相对独立的，不是文章正文的一部分。这段版权信息存在的主要意义就是防止自动化的工具批量转载博客文章，或许“防止”一词并不恰当，但我们之所以要将版权声明放在正文里，就是希望这些自动化的抓取工具抓取文章时能将版权信息一并抓去。

同时，我们还希望在版权信息中给出这篇文章的永久链接，这样在文章被抓取之后，还会有一个链接指向原文，这样不但可以作为原文被转载的明确证据，同时可以提高原文在搜索引擎中的PageRank。

Hexo博客系统具有良好的可扩展性，我们可以编写一个插件，来实现自动化地为每一篇文章追加版权信息。

<!--more-->

## 添加Filter插件

Hexo的插件分为Deployer、Filter、Generator、Renderer、Tag等很多种类。其中[Filter插件](https://hexo.io/api/filter.html)用于修改一些特定的数据。在Hexo系统内部，已经注册了一类称为`before_post_render`的Filter插件。这种Filter会在文章正式渲染之前执行，具体的执行和渲染步骤可以参见关于渲染的[官方文档](https://hexo.io/api/posts.html#Render)。

由于这个功能比较简单，代码量应该也不大，我们不必将其做成一个完整的插件，将其写成一个js脚本，然后放在博客根目录的scripts目录下就可以方便地完成任务。如果你还不了解Script和Plugin的区别，也可以参考关于插件的[官方文档](https://hexo.io/docs/plugins.html)。

注册一个`before_post_render`类型的Filter的代码如下：

```js
hexo.extend.filter.register('before_post_render', function(data){
    return data;
});
```

这样我们就可以在渲染每一篇文章时得到文章内容，并对内容进行修改。Hexo会接收这个Filter的返回值，将其中的内容用于后续的渲染步骤。也就是说在这个函数里对文章内容做出的修改，会最终渲染到输出的HTML代码中。

## 追加版权信息

上文代码中的`data`其实是一个文章的对象，其中的`content`字段就代表了文章的源代码（通常是Markdown代码）。我们可以将想要的版权信息追加到这个字段当中，这样这些版权信息就会被送入到后续环节生成HTML代码了。

另外，在博客的某些特定的文章或者页面上，我们可能不想在上面追加版权信息，应该允许用户排除某些特定页面，而在其余的页面上追加版权信息。这个实现起来也很简单，我们可以在不想添加版权信息的页面front-matter中添加一行`copyright: false`，这个`copyright`字段也会随着`data`对象送入Filter，我们可以在代码中判断一下，如果用户确实指定了`copyright`字段为`false`，则不追加版权信息。当然`copyright`这个字段名是我自己起的，你也可以随便用一个自己喜欢的字段名，文中和脚本中保持一致即可。

由于我比较懒，懒到`copyright: false`都懒得写，由于太懒，所以经常写一些非常短的文章，文章短到比版权信息还要短。这种文章我就不好意思再追加一大串版权信息了，所以我还希望能在文章长度小于50字时自动地不追加版权信息。这个也不难实现，再判断一下文章长度就可以了。

## 追加永久链接

如果版权信息还是给人看的话，那永久链接纯粹就是给机器人看的了。永久链接最好是做成带有链接的URL。这样这个URL不论是否是一个超链接，都可以被搜索引擎捕捉到。同样地，在`data`对象中也有一个字段表示了文章的永久链接，也就是`permalink`字段。将这个字段中的URL追加在文章内容之后，后面的Markdown处理器会自动将其处理为一个超链接。

## 代码实现

满足上述所有需求的代码如下：

```js
// Add a tail to every post from tail.md
// Great for adding copyright info

var fs = require('fs');

hexo.extend.filter.register('before_post_render', function(data){
    if(data.copyright == false) return data;
    var file_content = fs.readFileSync('tail.md');
    if(file_content && data.content.length > 50) 
    {
        data.content += file_content;
        var permalink = '\n本文永久链接：' + data.permalink;
        data.content += permalink;
    }
    return data;
});
```

在具体的代码实现中，我将版权信息保存在了一个名为`tail.md`的文件当中，在使用时将该文件的内容追加到文章的最后。在读文件时需要注意的是，`before_post_render`的回调函数是似乎是被同步调用的，也就是说如果函数什么都不返回就结束的话，hexo会直接将未修改的`data`对象交给后续步骤。所以文件读取操作必须使用同步的`fs.readFileSync`，如果使用异步的版本，会发现data什么都没有追加，直接执行后续步骤了。

将上述代码保存在一个js文件中，放到博客根目录下的scripts目录中，另外编写一个版权信息的md文件，放在博客根部录下。重新生成博客，应该就可以看到满意的效果了。