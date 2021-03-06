---
title: 卫星云图压缩
data: 2014-03-21 23:54:36
---

用于网页在线演示的卫星云图，需要动画效果。即连续播放时间间隔为1小时的24幅图像。每幅图像600*800像素。GIF格式，256色，尺寸约350KB。播放过程需要长时间载入，载入完后播放停滞现象严重。还会出现白屏。

初步分析：大地部分重复接受，如果能仅接收云层部分，再叠加到空白地图上，可减少接收的数据量。

模拟处理：将云图导入Photoshop，转换为RGB颜色，Gamma2.2灰度。选择色彩范围，基色为白色。发现灰度后，黄土部分颜色与薄的云层相似。因而无法分离。

改进模拟：在进行灰度处理前，过滤掉红通道（将红通道全部置为0），可有效减少黄土部分的干扰。

编程实现：打开图像，过滤红通道进展顺利。灰度处理开始用305911法，发现图像灰暗，后改用Gamma2.2。选择色彩范围遇到一点困难，主要是对容差的理解。我的理解是基色左右各二分之一的容差。编完后发现结果与Photoshop差别太大。后发现是基色左右都是容差的值，不用除以2。调试几次后也好了。

结果验证：生成的图像全部填充255（白色）云层部分设定相应的Alpha值。保存PNG格式。图像尺寸缩小1/3。变化不明显。

结果分析：云层RGB都为255，无重复记录的必要。实际上仅保存Alpha（也就是应用于白色底色的蒙版）就可以了。这样每像素8位即可。却发现GIF也是每像素8位，这样只不过省出调色板的2K大小。难道忙活一通分离出云层只省下调色板？

改进模拟：在Photoshop中模拟发现，256级灰度的云层仅保留16级灰度，变化并不明显。想到将256级灰度降为16级。这样每像素仅4位。

编程实现：编写程序，把8个像素用位运算存到一个整型变量中。以二进制方式写入硬盘。

结果验证：用WinRAR压缩。文件尺寸为70KB左右。

结果分析：用无损压缩的方法压缩率已经达到极限。想要进一步压缩应采用有损压缩。可将3张分离出的云层图像存入RGB三个通道，再保存为JPEG格式，设定较高的压缩率。即在一张图像中存储3张不同的云图图像（均为256级灰度）。这样JPEG图像本身已经没有意义，用时须将3个通道分离出来。

模拟处理：在Photoshop中新建一个文件，在三个通道中粘贴三张不同的云图。保存为JPEG，质量设为2.保存后尺寸约60KB。相当每张图像20KB。（生成的图像附后，确实很抽象哦~~）

编程实现：没有遇到困难。与模拟的一样。

总结改进与猜想：上述过程在一张JPEG中存储3张256级灰度图像。若将灰度级别降为16级，则可在一个字节中存入两个像素。在每个通道的低位存储一张16级图像，高位再存储一张。一个张JPEG图像即可存储6张云图。相当每张仅10KB。已经编程实现，由于没有编写解码程序，故没有验证这种方法的有效性。

结果：现在可确定将350KB压缩为20KB。压缩为10KB待验证。结果比较令人满意。

最后，附上三合一的抽象画供大家欣赏~~~！

![](/images/nephogram-image-compression-1.jpg)
