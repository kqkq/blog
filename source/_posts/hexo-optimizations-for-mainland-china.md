title: Hexo Landscape主题的字体和JS库优化
date: 2015-02-12 14:54:02
tags:
categories: 工巧匠心
toc: true
---

Hexo博客系统的作者来自台湾，因此在这个系统中也使用了一些不符合大陆实际情况的服务，除了留言板、分享按钮等无关大雅的东西之外，直接影响网站打开速度和呈现效果的东西就是来自Google的字体和JavaScript库了，由于Google在大陆基本处于被阻断的状态，所以我们有必要对其中涉及Google服务的地方进行替换。另外，如果使用Windows系统访问，会发现页面上的字体默认为宋体，丑陋的字体也严重影响了访客浏览的体验，我们也需要对跨平台的字体呈现效果进行优化。

Hexo的Landscape主题对Google的引用主要有2个，第一是使用了在Google上托管的jQuery库，第二是使用了Google的Source Code Pro字体。在Google被封锁后，大部分网友推荐使用360的CDN，也就是useso.com的库，但我经过测试后发现360的CDN在国外的访问速度极慢。网友之所以推荐360的CDN，是因为它可以简单的直接替换Google的服务，只需要改一下域名，URL的其余部分都无需改动。而我发现提供jQuery的国内互联网厂商比比皆是，而提供Google Code Pro字体的除了360还没有找到。因此我希望能够将这两个问题分别解决，而不是用useso一替换了之。

<!--more-->

## jQuery库的优化

国内提供jQuery的互联网公司很多，大家耳熟能详的互联网公司基本都免费提供了常用JS库的CDN加速服务。在我的测试中，百度的服务的速度在国内国外都比较理想，因此这里将jQuery替换成百度的。另外，我还希望在百度的服务暂时不可用时，能够以网站上自带的jQuery作为备份。

我们要修改的是`themes/landscape/layout/_partial/after-footer.ejs`这个文件，将17行的

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
```

替换为如下代码：

```html
<script src="http://apps.bdimg.com/libs/jquery/2.0.3/jquery.min.js"></script>
<script type="text/javascript">
//<![CDATA[
if (typeof jQuery == 'undefined') {
  document.write(unescape("%3Cscript src='/js/jquery-2.0.3.min.js' type='text/javascript'%3E%3C/script%3E"));
}
// ]]>
</script>
```

这里不但将Google的jQuery替换成了百度的，随后还进行了一个判断，如果获取百度的jQuery失败，则使用本网站自己的jQuery。为了让这段代码有效，我们要去jQuery官方下载合适版本的jQuery并将其放到`themes/landscape/source/js/`目录下，我将其命名为`jquery-2.0.3.min.js`。还有一点需要特别注意，那就是jQuery这个文件在hexo生产博客时会被解析，因此一定要将jQuery文件开头处的`//@ sourceMappingURL=jquery-2.0.3.min.map`这一行代码删去，否则会导致博客无法生成。

## 跨平台字体优化

为了能在各个平台上都显示令人满意的字体，我们要修改CSS文件中的字体设置，列出多个备选的字体，操作系统会依次尝试，使用系统中已安装的字体。我们要修改的是`themes/landscape/source/css/_variables.styl`这一文件，将其中第22行

```css
font-sans = "Helvetica Neue", Helvetica, Arial, sans-serif
```

改成如下内容：

```css
font-sans = "Helvetica Neue", "Helvetica", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans CN", "WenQuanYi Micro Hei", Arial, sans-serif
```

其中海维提卡（Helvetica）、Arial是英文字体，前者一般存在于苹果电脑和移动设备上，后者一般存在于Windows系统中。冬青黑体（Hiragino Sans GB）、思源黑体（Source Han Sans CN）、文泉驿米黑（WenQuanYi Micro Hei）是中文字体，冬青黑体从OS X 10.6开始集成在苹果系统中，文泉驿米黑在Linux的各大发行版中均较为常见，而思源黑体是近期Google和Adobe合作推出的一款开源字体，很多电脑上也安装了这一字体。这样一来，在绝大部分操作系统中就可以显示美观的字体了。

## 代码等宽字体优化

Hexo默认的等宽字体是Google的Source Code Pro，我认为为了一个等宽字体去牺牲网站的访问速度实在是有点不值得，而且系统中也会提供一些较为美观的等宽字体。所以相比于绞尽脑汁去获取Google的等宽字体，不如弃用这个在国内残念的字体，然后用与之前类似的方法来列出备选的系统自带字体。要编辑的文件同样是`themes/landscape/source/css/_variables.styl`这一文件，将其中第24行

```css
font-mono = "Source Code Pro", Consolas, Monaco, Menlo, Consolas, monospace
```

改成如下内容：

```css
font-mono = Consolas, Monaco, Menlo, monospace
```

最后我们要删除引用Google字体的代码，要编辑的文件是`themes/landscape/layout/_partial/after-footer.ejs`，将其中的下列代码删除。

```html
<link href="http://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css">
```

重新生成博客，一切都和谐了。