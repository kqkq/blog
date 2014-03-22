title: 在Mac OS系统下配置CTeX+XeLaTeX方案处理中文文档
date: 2011-08-07 15:28:48
tags:
categories: 果粉手札
---

我的软件环境是：
* 操作系统：Mac OS X Lion 10.7
* TeX系统：MacTeX 2011
 
理论上来说，更新版本的软件应该也可以工作

CTeX包提供了较为完善的中文支持，排版的方案（例如段落缩进）也符合中国人的习惯，但是CTeX是基于Windows设计的，在移植到Mac时会出现一些小问题。主要是字体的问题，CTeX中默认使用的SimSun等字体在Mac OS中并不存在，取而代之的是“华文宋体”等华文系列的字体。因此如果不配置，会因找不到字体而出现编译错误。另外，在Windows中常用的“隶书”和“幼圆”两种字体，在Mac OS中根本不存在，也没有可以替换的字体。

<!--more-->

对于缺失的隶书和幼圆，我们使用Windows中的字体，可以在[这里](http://tinker-bot.googlecode.com/files/cfonts.tar.gz)下载。我们只用到其中的simli.ttf和simyou.ttf这两个字体。另外的4的Adobe字体在我的系统中已经自带（也可能是我安装Photoshop时装上的？）

打开应用程序中的“字体册”，点“所有字体”，再在菜单栏中点“文件”-“添加字体”，选择从刚下载的压缩包中解压出的simli.ttf和simyou.ttf，你也可以点击“中文”标签来检查一下四个Adobe字体是否已经自带，如果没有，就在添加字体时把它们也加进来。默认情况下字体会安装到你的用户文件夹下，如果你希望计算机上所有的用户都可以使用这些字体，可以在字体册偏好设置里设置将其安装到系统字体文件夹中（我是这么做的）。当然这需要你有root的口令。

安装好字体后需要修改一下配置文件，在应用程序中打开终端，输入下列命令

``` bash
sudo vim /usr/local/texlive/2011/texmf-dist/tex/latex/ctex/fontset/ctex-xecjk-winfonts.def
```

（如果您不会用vim就换个编辑器— —||，比如nano） 

输入密码后将其内容替换为：

``` plain
\setCJKmainfont[BoldFont={STHeiti},ItalicFont=STKaiti]{STSong}
\setCJKsansfont{STHeiti}
\setCJKmonofont{STFangsong}

\setCJKfamilyfont{zhsong}{STSong}
\setCJKfamilyfont{zhhei}{STHeiti}
\setCJKfamilyfont{zhkai}{STKaiti}
\setCJKfamilyfont{zhfs}{STFangsong}
\setCJKfamilyfont{zhli}{LiSu}
\setCJKfamilyfont{zhyou}{YouYuan}

\newcommand*{\songti}{\CJKfamily{zhsong}} % 宋体
\newcommand*{\heiti}{\CJKfamily{zhhei}}   % 黑体
\newcommand*{\kaishu}{\CJKfamily{zhkai}}  % 楷书
\newcommand*{\fangsong}{\CJKfamily{zhfs}} % 仿宋
\newcommand*{\lishu}{\CJKfamily{zhli}}    % 隶书
\newcommand*{\youyuan}{\CJKfamily{zhyou}} % 幼圆

\endinput
```

同理修改另外一个配置文件，命令是

```
sudo vim /usr/local/texlive/2011/texmf-dist/tex/latex/ctex/fontset/ctex-xecjk-adobefonts.def
```

加入两行以支持隶书和幼圆，修改后的内容为：

``` plain
\setCJKmainfont[BoldFont=Adobe Heiti Std,ItalicFont=Adobe Kaiti Std]{Adobe Song Std}
\setCJKsansfont{Adobe Heiti Std}
\setCJKmonofont{Adobe Fangsong Std}

\setCJKfamilyfont{zhsong}{Adobe Song Std}
\setCJKfamilyfont{zhhei}{Adobe Heiti Std}
\setCJKfamilyfont{zhfs}{Adobe Fangsong Std}
\setCJKfamilyfont{zhkai}{Adobe Kaiti Std}
\setCJKfamilyfont{zhli}{LiSu}
\setCJKfamilyfont{zhyou}{YouYuan}

\newcommand*{\songti}{\CJKfamily{zhsong}} % 宋体
\newcommand*{\heiti}{\CJKfamily{zhhei}}   % 黑体
\newcommand*{\kaishu}{\CJKfamily{zhkai}}  % 楷书
\newcommand*{\fangsong}{\CJKfamily{zhfs}} % 仿宋
\newcommand*{\lishu}{\CJKfamily{zhli}}    % 隶书
\newcommand*{\youyuan}{\CJKfamily{zhyou}} % 幼圆

\endinput
```

下面我们来测试配置，使用TeXShop作为IDE，代码存为UTF-8编码，以XeLaTeX编译。

测试文档使用xiaoyong的[高层方案](http://blog.xiaoyong.org/?p=85)，内容如下：

```plain
\documentclass[UTF8]{ctexart} % 采用Mac字体
%\documentclass[UTF8,adobefonts]{ctexart} % 采用Adobe字体

%以上两行分别测试华文字体和Adobe字体，请交替使用

\title{\LaTeX 中文设置之高层方案}
\author{xiaoyong}
\date{\today}
 
\begin{document}
\maketitle
 
\begin{center}
  1. 字体示例：\\
  \begin{tabular}{c|c}
    \hline
    \textbf{\TeX 命令} & \textbf{效果}\\
    \hline
    \verb|{\songti 宋体}| & {\songti 宋体}\\
    \hline
    \verb|{\heiti 黑体}| & {\heiti 黑体}\\
    \hline
    \verb|{\fangsong 仿宋}| & {\fangsong 仿宋}\\
    \hline
    \verb|{\kaishu 楷书}| & {\kaishu 楷书}\\
    \hline
    \verb|{\lishu 隶书}| & {\lishu 隶书}\\
    \hline
    \verb|{\youyuan 幼圆}| & {\youyuan 幼圆}\\
    \hline
  \end{tabular}
\end{center}
 
\begin{center}
  2. 字号示例：\\
  {\zihao{0}初号}
  {\zihao{1}一号}
  {\zihao{2}二号}
  {\zihao{3}三号}
  {\zihao{4}四号}
  {\zihao{5}五号}
  {\zihao{6}六号}
  {\zihao{7}七号}
  {\zihao{8}八号}
\end{center}
 
\end{document}
```