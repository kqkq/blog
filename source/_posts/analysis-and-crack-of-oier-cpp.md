title: 垃圾软件OIer C++深度分析及破解指南
date: 2011-08-03 02:34:50
tags:
categories: 编程之美
---

今天是8月3日，一个有那么一点点纪念价值的日子。3年前的今天，我在哈尔滨第三中学完成了第9届全国中小学电脑制作活动的现场答辩并参加了颁奖典礼。今天跟同学聊到这件事，想到电脑制作竞赛这几年应该也是进行的如火如荼，于是搜索了一下。果然，今年已经是第12届了，直接看获奖名单的程序设计分支，居然有3个山东的作品。想想我当年“零的突破”，自嘲一下……

说正事，获奖名单的第一个作品叫《OIer C++》，看起来好高端，估计是一个C++的编译器，带着膜拜之情Google了一下，发现我想错了，只是一个IDE而已……更重要的是，这个IDE，一个高中生做的IDE，居然还要收费20元……官方网站上的下载链接都是死链，情何以堪。再看产品介绍中浮夸的文字，不用下载我也对这个作品的德性有点估计了。

<!--more-->

在第三方网站上下载到了这个软件，安装完成，一打开就是一个浮夸的启动画面，然后要求输入用户名和注册码，否则连软件界面都见不到。我随便输入一个，卡了几秒，当即提示错误，并没有要求重启验证。被小我三届的孩子恶搞我当然不会就此罢休。心想非破了这个软件不可。网站上一再的强调使用者的计算机必须安装.Net Framework 3.5，不出意外的话这个程序就是用C#或者VB.Net写的了。想想上次逆向.Net程序，应该是大一上学期恶搞英语学习大厅的时候了。翻出当年的“武器”.Net Reflector，好久不用都过期了，升级了一下终于打开了。

二话不说把主程序拖进去，分析过程很顺畅，软件确实是.Net编写的，代码没有经过混淆，所有标识符清晰可见。虽然目前还没能进去软件的主界面，但从逆向的结果来看，整个软件只有5个对话框，如此简单的程序也能卖钱，让我很是好奇。

先看注册窗口，找到了注册按钮的事件处理程序

``` cs
private void registryButton_Click(object sender, EventArgs e)
{
    string str = "http://115.47.219.143/product/test/";

    try
    {
        byte[] bytes = new WebClient().DownloadData(string.Format("{0}?name={1}&number={2}", str, this.nameTextBox.Text, this.serialNumberTextBox.Text));
        string str2 = Encoding.ASCII.GetString(bytes);
        if (str2 == (this.nameTextBox.Text + this.serialNumberTextBox.Text + "ABCD"))
        {
            File.WriteAllText(@"C:\Documents and Settings\All Users\201.dat", "8888");
            base.Close();
        }
        else if (str2 == (this.nameTextBox.Text + this.serialNumberTextBox.Text + "DCBA"))
        {
            MessageBox.Show("还未收到付款");
        }
        else
        {
            MessageBox.Show("不正确");
        }
    }
    catch (WebException exception)
    {
        if (exception.Status == WebExceptionStatus.NameResolutionFailure)
        {
            MessageBox.Show("请检查网络连接");
        }
        else if (exception.Status == WebExceptionStatus.ProtocolError)
        {
            MessageBox.Show("服务器错误，请下次重试");
        }
        MessageBox.Show(exception.Status.ToString());
        MessageBox.Show(exception.Message);
    }
}
```

第一句话就吓我一跳，我擦居然是网络验证的，心想这下完蛋了，算法注册没戏，估计要爆破了。再往下看，我差点吐血……这是一个清晰的分支结构：1.注册成功 2.用户验证成功但未付款  3.用户不存在，失败

亮点在注册成功的那个分支：

``` cs
File.WriteAllText(@"C:\Documents and Settings\All Users\201.dat", "8888");
```

牛逼啊！！注册成功要做的事情居然是在`C:\Documents and Settings\All Users`目录下创建一个名为`201.dat`的文件，文件的内容是`8888`

孩子，还8888呢，你想钱想疯了吧……

不敢相信注册就这么简单，不如看看启动时软件是如何判断是否已经注册的。`StartForm`这个类看名字应该是启动画面吧，果然不出所料，用于检测注册状态的代码是：

``` cs
private void StartForm_Shown(object sender, EventArgs e)
{
    if (!this.FindInstall())
    {
        MessageBox.Show("请在http://www.n8lm.cn/ 下载正版n8lm版OIerC++安装程序。", "警告", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
        Application.Exit();
    }
    if (!this.FindCopyright())
    {
        new RegistryDialog().ShowDialog();
    }
    OptionSetting.Init();
    OptionSetting.LoadOption();
    Thread.Sleep(0x3e8);
    base.Close();
}
```

这里调用了两个函数，如果发现曾经装过软件，那就警告退出。如果没注册就弹出注册窗口。看了核心的东西就在`FindCopyright`里面了。最后请大家注意`Thread.Sleep(0x3e8);`这句话，怎么样，浮夸吧！！`0x3e8`翻译成十进制是`1000`，这句话就负责将线程阻塞1秒钟，目的是让启动画面多显示一会儿。也就是说启动画面背后并没有做什么工作，而只是单纯的在那儿卡1秒钟……

继续说`FindCopyright`，这个函数的定义是：

```
private bool FindCopyright()
{
    string str;
    try
    {
        str = File.ReadAllText(@"C:\Documents and Settings\All Users\201.dat");
    }
    catch (FileNotFoundException)
    {
        return false;
    }
    return (str == "8888");
}
```

怎么样，跪了吧！验证是否注册的方式就是读取`C:\Documents and Settings\All Users\201.dat`，然后判断文件内容是否为`8888`。

我默默的手动创建了这个文件，再打开，没有任何问题，软件成功启动了。

话说一篇讲破解的文章应该就此结束了，不过我还是想继续喷一下这个破软件。在我试用这个软件5分钟的时间内，我至少发现了3处错别字，可见这个软件是草草写就。点关闭按钮时不会退出，而是最小化到系统托盘，我想不明白此举的意义何在。当我从菜单中点关闭时，软件直接退出，完全无视我写了一半没保存的代码。再次打开时，没有手动保存的更改就丢失了。

你有可能要说了，作为一个高中生，能做出这么个东西就不错了。但是这款软件没有让我看到任何值得肯定的东西，也没有发现作者任何有意义的工作。

我查看了软件的安装文件夹，其中`DotNetSkin.dll`文件是一个皮肤组件，在该软件中应该是用于显示苹果风格的界面，值得一提的是，`DotNetSkin`是一款收费软件，最便宜的正版也需要150美金。OIer C++的作者应该是使用了`DotNetSkin`的破解版。这样也好意思出来收钱，实在是不可理喻！

再看`ICSharpCode.TextEditor.dll`，根据名字猜想这个dll应该提供了软件中的代码高亮显示编辑器，网上搜索证实了我的猜想。这个控件是开源的，基于MIT许可证分发。MIT许可证要求使用者必须在产品中注明原作者并保留版权声明。然而在OIer C++软件中我没有找到任何关于`ICSharpCode.TextEditor`的版权声明，全是作者自己的声明。

在另外一个文件夹中，我发现了`ptoc.exe`，这个程序用于将Pascal语言转换为C语言，而这个程序也是现有的工具，并非作者自己实现。

至此，作者标榜的全部“特色功能”要么是现成的，要么是盗版的。而就是这样一个垃圾软件竟然在全国中小学电脑制作活动中获得了二等奖，并堂而皇之的在网上叫卖，实在是贻笑大方。