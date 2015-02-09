title: 自动随机切换Hexo博客的banner图片
date: 2014-07-09 00:24:19
tags:
categories: 工巧匠心
toc: true
---

个人网站最重要的是什么？个性！hexo自带的landscape是个不错的主题，首先呈现在眼前的就是高度为300像素的大banner，一个精美的banner无疑会一下抓住访客的眼球，建立起对全站的第一印象。

landscape主题的banner虽然很大，但是只能是一张静态图片，略显死板。如果我们能对其稍加改造，让banner图片自动地随机切换为一些预设的图片，一定会是一件很酷的事情。下面我们就来动手实现这个设想！

<!--more-->

## 添加随机切换图片的脚本

我们首先要在`themes/landscape/layout/_partial/`下新建一个ejs文件，我将其命名为`switch-banner.ejs`，其中是用于切换banner图片的Javascript代码，该文件内容如下：

```html
<script>
    <% if (theme.switch_banner){ %>
    var number_of_banners = 6;
    var randnum = Math.floor(Math.random() * number_of_banners + 1);
    document.getElementById("banner").style.backgroundImage = "url(/css/images/banner" + randnum + ".jpg)";
    <% } else { %>
    document.getElementById("banner").style.backgroundImage = "url(/css/images/banner.jpg)";
    <% } %>
</script>
```

这段代码比较简单，随机生成一个1~6之间的随机整数，然后通过这个整数合成一个URL。我一共找了6张不同的banner图片，如果你的图片张数不同，也可以相应地修改`number_of_banners`数值。banner图片要放到`themes/landscape/source/css/images/`目录下，命名为`banner*.jpg`，其中的星号是一个数字。6张图片必须连续地使用1~6这6个数字。

## 修改模板调用上述脚本

下面要修改布局文件来调用这段脚本。在`themes/landscape/layout/_partial/header.ejs`的最后一行（`</header>`标记）之前加入一行`<%- partial('switch-banner') %>`即可。

最后，我们需要修改landscape模板的配置文件来开启这个特性。在`themes/landscape/_config.yml`中添加一行`switch_banner: true`。重新生成博客，多刷新几次，看看效果吧！

虽然实现了期望中的效果，但是我们发现浏览器还是会去请求原来的老banner，也就是`themes/landscape/source/css/images/banner.jpg`，这个文件比较大，会影响网页的打开速度。要避免浏览器请求这个文件，还需要修改一个CSS，打开`themes/landscape/source/css/_partial/header.styl`，找到`#banner`这一节，将其中的`background: url(banner-url) center #000`改成`background: center #000`，浏览器就不会再去请求已经废弃的`banner.jpg`了。如果在`_config.yml`中关掉了自动切换，我们的`switch-banner.ejs`脚本还是可以请求这个文件的，所以老的`banner.jpg`不用删掉。

## 制作banner图片时的注意事项

为了适应不同尺寸的显示器，CSS中对banner图片对齐方式的设定为`center`。我们假设图片是比较宽的条形（我制作的图片均为1920×800像素），**图片左右会两端会对齐到网页边缘，而上下部分会被切掉，只露出中间的高度为300像素的一条。**不论显示器多大，图片露出来的高度始终为300像素，而宽度则取决于显示器尺寸和窗口大小。又因为图片是等比例缩放的，所以换句话说，窗口越大，我们看到的图片内容就越少。如果你不明白这个道理，请取消网页的最大化，然后改变网页的宽度，观察banner图片的变化，就明白了~

正是由于这个原因，我们精心挑选的图片在一些显示器上会被剪裁的一塌糊涂。为了能在各种尺寸的显示器上都达到较好的显示效果，我们应该尽量将需要呈现的主体放在图片的中间位置（垂直方向的中间，水平方向无所谓），高度不要超过300像素太多。否则在大显示器上，就会出现明显的剪裁。对于不满足要求的图片，我们可以通过Photoshop对其进行一些处理，移动其主体的位置。移动之后，我们还可以通过Photoshop中的“内容感知缩放”（Content-Aware Scale）来填充移动后产生的空白。当然我们也可以选择一些风景画、抽象画等对剪裁不敏感的图片。

最后，由于图片尺寸较大，会占用较多的网络带宽，可能会对网页的打开速度带来影响。所以我们应该设置一个较高的JPEG压缩比，在Photoshop中将质量参数设为5或者6，将图片的大小控制在100KB出头是比较理想的。对于一些由色块构成的抽象画，则可以设置更高的压缩比。总之，建议大家尝试着调整压缩比，找到一个文件比较小，又不明显影响图片质量的压缩比。
