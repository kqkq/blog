title: Xcode 5 + iOS 7免证书(iDP)真机调试与生成IPA全攻略
date: 2014-03-14 18:47:36
tags:
categories: 果粉手札
---

众所周知，在Xcode上开发的程序只能在模拟器中运行，如果要放到真机上则要花费99美金购买开发者证书iDP。这严重阻碍了我等草根开发者探索的脚步。写个小程序，同学间分享一下这个小小的愿望都不能满足，自然不能善罢甘休。

在没有iDP的情况下，要想将程序放到iPhone上调试，并最终发布IPA用于分享，需要以下几个步骤：

1. 自己为自己颁发一个证书用于为生成的程序签名
2. 修改工程配置以及Xcode的配置文件和二进制文件以阻止其验证和签名
3. 通过自定义生成步骤，用伪造的证书为应用程序签名
4. 使用一点小trick来生成IPA文件

<!--more-->

开发环境使用的是目前为止最新的稳定版软件：Mac OS X Lion 10.9.2 + Xcode 5

目前本人已经测试并证实有效的平台有：

* Xcode 4.1：
	- iPod touch 4 iOS 4.3.3
* Xcode 4.2：
	- iPod touch 4 iOS 4.3.3
	- iPod touch 4 iOS 5.0
	- iPod touch 4 iOS 5.0.1
* Xcode 4.2.1：
	- iPod touch 4 iOS 4.3.3
	- iPod touch 4 iOS 5.0.1
	- iPhone 4S iOS 5.0.1(5A406)
* Xcode 4.3
	- iPhone 4S iOS 5.0.1(5A406)
* Xcode 4.3.2
	- iPhone 4S iOS 5.1.1
* Xcode 4.4.1 for Mountain Lion
	- iPhone 4S iOS 5.1.1
* Xcode 4.5 for Mountain Lion
	- iPhone 4S iOS 5.1.1
* Xcode 4.6 for Mountain Lion
	- iPhone 4S iOS 6.1

另外，操作系统的版本貌似对调试影响不大，这期间用过的系统有Mac OS X 10.6~10.9.2，都没有问题。当然您需要先越狱您的设备并通过Cydia安装AppSync。

### 1. 创建证书

创建证书的过程比较简单，打开实用工具-钥匙串访问。然后在菜单栏里点击钥匙串访问-证书助理-创建证书来打开向导。第一个步骤比较重要，必须要把名称命名为iPhone Developer，将类型设定为代码签名，将"让我覆盖这些默认值"选中。之后的步骤无需更改，一路点击“确定”和“继续”来完成这个向导就可以。

![][cert]

### 2. 修改Xcode的配置文件

下面的步骤稍微有点繁琐，您应该了解UNIX命令行的基本操作，并了解一种命令行文本编辑器，本文使用的是vim。尽管这里会给出完整的代码，但是关于修改和保存代码的基本操作，不再赘述。下面的操作请先将Xcode按`Command+Q`完全关闭。

1. 进入iPhone SDK目录

	``` bash
	cd /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS7.0.sdk/
	```

	不同版本的Xcode只是最后的版本号不同。在Xcode 5.0中是`iPhoneOS7.0.sdk`，未来版本可能版本高一些，早期版本的就低一些。这个请大家自己改动。
	
2. 备份原文件

	``` bash
	sudo cp SDKSettings.plist SDKSettings.plist.orig
	```
	
3. 编辑配置文件

	在不同版本的Xcode中，这个配置文件的编码方式并不相同。有的版本是XML格式，有的版本则是二进制格式的。为了方便修改，我们可以直接用Xcode打开这个文件。首先要打开这个文件所在目录：
	
	``` bash
	open .
	```
	
	在弹出的Finder窗口中双击`SDKSettings.plist`，会启动Xcode的图形界面，我们展开`DefaultProperties`分支，将下面的`CODE_SIGNING_REQUIRED`和`ENTITLEMENTS_REQUIRED`两个属性改为`NO`

4. 编辑另外一个配置文件

	``` bash
	cd /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform
	sudo cp Info.plist Info.plist.orig
	open .
	```

	在弹出的Finder窗口中双击打开`Info.plist`。将全部的`XCiPhoneOSCodeSignContext`修改成`XCCodeSignContext`，共有3处。分别在`DefaultProperties`分支下、`RuntimeRequirements`分支下和`OverrideProperties`分支下。

至此，对SDK中配置文件的修改就完成了

### 3. 准备自定义的生成后脚本

连接互联网后执行

``` bash
mkdir /Applications/Xcode.app/Contents/Developer/iphoneentitlements
cd /Applications/Xcode.app/Contents/Developer/iphoneentitlements
curl -O http://www.alexwhittemore.com/iphone/gen_entitlements.txt
mv gen_entitlements.txt gen_entitlements.py
chmod 777 gen_entitlements.py
```

热心网友指出，这里可能涉及到权限问题。我做的时候貌似没有出啥问题，如果您在执行这段代码时遇到Permission denied提示的话，请将相应的语句前面加上sudo以获取超级权限。

如果您已经联网，则请直接转到步骤4，如果您没有联网，那么请在相应目录手动创建`gen_entitlements.py`并授予其执行权限，这个文件的内容为:

``` python
#!/usr/bin/env python

import sys
import struct

if len(sys.argv) != 3:
	print "Usage: %s appname dest_file.xcent" % sys.argv[0]
	sys.exit(-1)

APPNAME = sys.argv[1]
DEST = sys.argv[2]

if not DEST.endswith('.xml') and not DEST.endswith('.xcent'):
	print "Dest must be .xml (for ldid) or .xcent (for codesign)"
	sys.exit(-1)

entitlements = """
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>application-identifier</key>
	<string>%s</string>
	<key>get-task-allow</key>
	<true/>
</dict>
</plist>
""" % APPNAME

f = open(DEST,'w')
if DEST.endswith('.xcent'):
	f.write("\xfa\xde\x71\x71")
	f.write(struct.pack('>L', len(entitlements) + 8))
f.write(entitlements)
f.close()
```

### 4. 修改工程设置

特别注意：本阶段之前的修改配置文件、准备脚本等，只需要做一次。但本阶段的操作，对每个需要真机调试的工程都要做一遍。

这个步骤的主要作用是支持真机调试，如果不做这个步骤，仍然可以通过步骤5来生成ipa在真机上运行，但是无法使用Xcode内置的调试器对在真机上运行的程序进行单步跟踪。如果您的程序在点击Run真机调试时秒退，请检查此步骤是否正确完成。

1. 禁用Xcode自动的签名操作

	将工程配置中所有的Code Signing选项全部设为Don't Code Sign，如图。可能需要先点击“All”让这个选项显示出来
	
	![][signing]
 
2. 添加自定义的生成后脚本
在Build Phases中添加一个Build Phase，输入以下脚本

	``` bash
	export CODESIGN_ALLOCATE=/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/codesign_allocate
	if [ "${PLATFORM_NAME}" == "iphoneos" ] || [ "${PLATFORM_NAME}" == "ipados" ]; then
	/Applications/Xcode.app/Contents/Developer/iphoneentitlements/gen_entitlements.py "my.company.${PROJECT_NAME}" "${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}/${PROJECT_NAME}.xcent";
	codesign -f -s "iPhone Developer" --entitlements "${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}/${PROJECT_NAME}.xcent" "${BUILT_PRODUCTS_DIR}/${WRAPPER_NAME}/"
	fi
	```

	对于Xcode 5，要在Editor菜单下的Add Build Phase项中添加，Build Phase，如图：

	![][script1]

	对于Xcode 4，在右下角的“加号”处添加，如图：

	![][script2]
 
	至此配置全部完成，下面就可以插上iPhone，重新选择生成目标来测试一下在线调试了！如果是第一次使用该设备调试，请先在Organizer中将设备切换为开发模式，具体操作请见常见问题5。

### 5. 旁门左道生成IPA文件

如果我的程序调试好了，怎么才能发给别人用呢？正常情况下IPA文件是从Xcode的Organizer中输出的，但是我们没有证书，这样输出会产生错误。我们只能用个小trick来完成这个操作了。

先将代码生成为Release目标，然后打开工程的输出文件夹，通常情况下这个目录是
`/Users/你的用户名/Library/Developer/Xcode/DerivedData/以工程名打头的文件夹/Build/Products/Release-iphoneos`很纠结吧~这个目录下有个.app的文件，就是生成的程序了。把这个.app拖到iTunes中，它会出现在应用程序那个列表中，然后再把它从iTunes的那个列表中拖出来（比如拖到桌面），发生了什么？哈哈，它就这样变成.ipa了！

把这个.ipa发给朋友，大家就可以跟您一起分享这个程序了。

### 6. 答疑解惑

1. 我是初学者，请问什么是权限？执行权限（x权限）是什么意思？什么是脚本？如何加执行权限？sudo是什么命令？vim是什么，如何在vim中保存更改？你说的目录我没找到怎么办？我有些步骤没看明白，能不能加QQ交流？

	解答：首先感谢您关注我的博客。这里要提醒各位初学者朋友，Xcode提供了非常完善的模拟器调试环境，模拟器调试要比真机调试方便得多，也简单得多，使用模拟器调试程序是iOS开发的常态。真机调试通常是在产品快要完工时才进行的，看一下程序在实际机器上的视觉效果等等。还有依赖于加速度计的程序要测试一下加速度计的程序有没有问题。所以初学者并不需要一开始就进行真机调试。初学者配置真机调试的主要目的可能并非学习技术，而是满足好奇心、追求成就感甚至是为了向朋友炫耀等等。而这些目的并不值得您花费这么大的精力来阅读本文。
	
	因此本文是给有一定基础的朋友看的，各种命令是免不了的。UNIX中的基本命令比如cp，mv，cd，chmod，sudo啥的还有vim编辑器，如果您都没听说过，强烈建议您不要尝试本文提到的修改。一旦改错了轻则Xcode挂掉，重则系统崩溃。如果遇到解决不了的问题欢迎留言询问，务必给出详细的错误信息，否则无法判断。博主恕不解答类似于如何执行脚本代码，如何赋予执行权限，如何使用vim编辑器（如何保存）等与iOS开发无关的UNIX基础问题。博主非常乐意以文会友，结识有思想、有创意、有技术的大牛。博主也会不定时到博客上对热心网友提出的问题进行简单的解答。但并没有充足的时间通过QQ对文中的步骤进行手把手的解释和指导。这里先向有这种需求的朋友说声抱歉了！

2. 各种错误，错误信息中包含“No such file or directory”这句话

	解答：错误信息的含义非常清楚，就是“没有这个文件或者目录”。这类错误通常是由于您拷贝代码时不全或者开发环境安装错误等问题导致的。请再次检查报错的目录是否存在，检查代码与本文给出的是否严格一致，各种检查吧~总之是低级错误

3. 联机调试时程序秒退，或者无法安装到设备，或者任何时候报错，错误信息中包含“code signing”、“CERT”、“signature”或者“certificate”字样的（最常见的错误）

	解答：证书错误或者签名错误，肯定是因为您没有严格文中的步骤做。提醒您检查的地方有：
	
	- 第一步中的plist文件是否已经正确修改
	- 有没有设置为Don't Code signing
	- 生成后事件的代码是否已经正确粘贴
	- 那个Python脚本是否已经成功执行
	- 设备是否已经越狱并安装AppSync
	- 第一步的iPhone Developer证书是否已经正确创建

	其中最可能出问题的就是生成后事件代码（文中的那个Run Script）没有正确执行。可能是您忘记了添加Run Script并粘贴那段代码，也可能是您没复制全，或者复制到了啥特殊字符导致执行出错。查看那个脚本执行结果的方法是在Xcode左侧的侧边栏里，点最靠右的一个标签（Show the Log navigator），看最近的一个Build日志（不是Debug日志），找到一行Run custom shell script "Run Script"那一行，正常情况下那一行跟其他行一样，是不能展开的。如果那一行左边有个小箭头，点击后能展开的话，说明执行出错，展开后的信息即为出错的信息。请认真查看错误信息并修正脚本中的错误。如果Build日志里根本没有Run custom shell script "Run Script"，那说明您忘记添加Build script了。。。

	Run Script经常报的一条错误是“replacing existing signature”。。。这个提示的意思是“替换已有的签名”，出现这个提示的原因是，你并没有成功的阻止Xcode使用默认的方法为应用程序签名。因为这个破解的原理就是阻止Xcode为app签名，而用script中的自定义过程手动为app签名。当script为app签名时，发现app已经被Xcode签名过了，就会报这个错误。出这个错误后提醒您检查的地方有两个
	
	* SDKSettings.plist中需要修改的地方是否已经正确修改
	* 工程设置里是否将那5个签名的选项全部设为Don't Code signing
	
4. iPad能用吗？

	解答：上述所有步骤无需修改可直接用于iPad开发。

5. 为什么我的Build for Archiving选项是灰色的？

	解答：是因为您没有把设备插到电脑上。或者设备未开启开发模式。开启开发模式的方法是：插上设备，点Xcode右上角的Organizer图标（在Xcode 5中，点击Window菜单下的Organizer项），选中您的设备，看一下设备名称左侧的小灯是什么颜色的。若是灰色代表未开启开发模式。此时在右边窗口中点击“Use for Development”即可。若是黄色请重新插拔设备，若是绿色代表设备已经开启开发模式

	点击Use for Development后，会要求输入Apple ID，这里点击取消即可。这时启用设备开发模式的进程会立即终止。设备名称旁边应该有一个黄灯。此时重新插拔设备，Organizer中会出现一个进度条），等这个进度条跑完，小灯就会变成绿色，开发模式已经启用。
	
	最近经常有人提问说，无论怎么搞，Organizer中的灯始终是黄色的。这种情况几乎可以百分之百的确定是您的Xcode版本不够高。如果您的设备是iOS 5.1.1，则必须使用Xcode 4.3.2或以上版本。同样的道理，iOS 5.0.1对应Xcode 4.3.1，iOS 5.0对应Xcode 4.3……

6. 我的iOS版本/Xcode版与你的不同，能用吗？

	解答：本人测试过的环境和设备已经在文章开头给出。其他环境我没有测试过，也没有条件测试，因此当您的环境与我的不同时，别问我可不可用，您可以试一下，然后把结果告诉我，也为其他的网友提供方便，在此先谢谢您了！

7. 真机调试时出现Error launching remote program: failed to get the task for process xxx错误

	解答：如果该错误出现在编译运行之后，且现象为设备上的程序闪退，则是由于签名错误导致的，这是由于您没有严格按照上述步骤来做导致的，请参考常见问题3。

[cert]: /images/ios-development-1.png
[signing]: /images/ios-development-2.png
[script1]: /images/ios-development-3.png
[script2]: /images/ios-development-4.png