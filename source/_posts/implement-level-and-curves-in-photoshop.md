title: Photoshop中的色阶/曲线命令原理详解与编程实现
date: 2009-05-22 19:51:12
tags:
categories: 绘云描鲤
math: true
---

Photoshop功能强大，使用灵活。初级使用者通常有几个难点：

1. 图像->调整  菜单（色阶，曲线等命令都在此菜单中）
2. 蒙版与矢量工具（如钢笔工具）
3. 通道与色彩模式
4. 图层混合模式

要用好这些命令，不但需要有较高的计算机操作水平，更重要的是需要对其原理有一定的了解。而这通常涉及到色彩模型等抽象概念与贝塞尔曲线（所有矢量工具的基础），线性映射（其实就是函数）等数学知识。其原理并不是十分复杂。本文前半部分解析色阶和曲线两个命令的基本原理，适合有一定基础的Photoshop玩家；后半部分使用C# 3.0语言编程实现，适合图像处理爱好者。

<!--more-->

色阶、曲线两个命令，都基于“亮度映射”原理。其实，就是一个简单的函数。输入色阶（图像原来的色彩）为自变量，输出色阶（运算处理后的色彩）为因变量。在色阶命令中，这个映射是一个一次函数关系的线性映射。而在曲线命令中，还可以是自定义的非线性映射。看图就明白啦~~

如图所示，所有亮度**低于输入色阶黑色滑块所指亮度**的像素，全部被映射为**输出色阶黑色滑块所指亮度**。

同理，所有亮度**高于输入色阶白色滑块所指亮度**的像素，全部被映射为**输出色阶白色滑块所指亮度**。

![][level]

那在输入色阶黑白滑块之间的像素，是怎样映射的呢？

我们结合曲线命令来理解。下图的映射曲线与上图的色阶设置是**完全等效**的。其实，色阶命令只不过是曲线命令的一个子集。为了方便使用，又单独设置了一个色阶命令。上面色阶的设置，实际就对应的这样一条映射曲线。

![][curve]

曲线斜率$k$可以通过如下公式计算：

$$
k = \frac{\Delta y}{\Delta x} = \frac{oW-oB}{iW-iB}
$$

   输入色阶黑白滑块间的像素，按照一次函数，映射到输出色阶。标注在两图上的符号式对应的。大家可以对照理解。利用高中解析几何知识，我们可以求出曲线的斜率。从而编程实现色阶命令。
 
-----

下面使用C#编程实现，编译时请打开`/unsafe`编译开关。

``` 
using System.Drawing;//图像处理
using System.Drawing.Imaging;//LockBits

/// <summary>
/// 色阶调整
/// </summary>
/// <param name="b">位图对象，24位彩色</param>
/// <param name="iB">输入色阶，黑场</param>
/// <param name="iW">输入色阶，白场</param>
/// <param name="oB">输出色阶，黑场</param>
/// <param name="oW">输出色阶，白场</param>
/// <returns>位图对象，24位彩色</returns>
public static Bitmap Gradation(Bitmap b, byte iB, byte iW, byte oB, byte oW)
{
    byte[] Map = new byte[256];//亮度映射表
    for (int i = 0; i <= iB; i++) //将小于输入色阶黑色滑块值的像素映射为输出色阶黑色滑块值
        Map[i] = oB;
    for (int i = iW; i <= 255; i++) //将大于输入色阶白色滑块值的像素映射为输出色阶白色滑块值
        Map[i] = oW;
    double detX = iW - iB;//x变化量，即输入色阶范围
    double detY = oW - oB;//y变化量，即输出色阶范围
    double k = detY / detX;//映射曲线斜率
    double Sum = oB;//色彩映射累加器，相当于因变量y
    for (int i = iB + 1; i < iW; i++)
    {
        Sum += k;
        Map[i] = (byte)Math.Round(Sum);
    }
    return ApplyMapping(b, Map); //将映射表应用于图像
}

/// <summary>
/// 应用色彩映射
/// </summary>
/// <param name="bp">位图对象，24位彩色</param>
/// <param name="Map">色彩映射表（0~255，byte数组）</param>
/// <returns>位图对象，24位彩色</returns>
public static Bitmap ApplyMapping(Bitmap bp, byte[] Map)
{
    Bitmap b = new Bitmap(bp);  //若仅作一次处理，不进行实时预览，此行可去掉
    BitmapData data = b.LockBits(new Rectangle(0, 0, b.Width, b.Height),
                                 ImageLockMode.ReadWrite, PixelFormat.Format24bppRgb);
    int offset = data.Stride - data.Width * BPP;
    unsafe
    {
        byte* p = (byte*)(data.Scan0);
        for (int i = 0; i < data.Height; i++) //循环读取每个像素的每个通道，查表赋值
        {
            for (int j = 0; j < data.Width; j++)
            {
                for (int k = 0; k < 3; k++)
                {
                    p[k] = Map[p[k]];
                }
                p += BPP;
            }
            p += offset;
        }
    }
    b.UnlockBits(data);
    return b;
}
```

[level]: /images/level-and-curves-1.png
[curve]: /images/level-and-curves-2.png