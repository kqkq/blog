---
title: 自己动手用OpenCV写个照相机（用摄像头拍照）
date: 2011-02-18 23:28:21
tags:
categories: 绘云描鲤
---

 不止一次听到同学的抱怨，说Win7下貌似没有用摄像头拍照的功能。在XP系统中貌似是在“我的电脑”里就能找到摄像头，也可以直接拍照。Win7没有了这项功能。我不知道Win7到底是不是还自带了拍照功能，也不想去找。与其去下载一些国产垃圾软件来实现这个简单的功能，不如自己动手写个照相机~

 用OpenCV的库，就会有一种游刃有余的感觉。不到30行，就可以完成一个简单的照相程序。代码贴上，也做了简单的注释。欢迎各位拍砖~

```
#include <cstdio>
#include <highgui.h>
int main()
{
    IplImage *pImg = NULL;
    CvCapture *cap = cvCaptureFromCAM(0);
    char fileName[100];
    char key;
    int count = 0;

    while(1)
    {
        pImg = cvQueryFrame(cap);
        cvFlip(pImg, NULL, 1); //水平翻转图像，像照镜子一样，不想要这个效果可以去掉此句
        key = cvWaitKey(50);
        if(key == 27) break; //按ESC键退出程序
        if(key == 'c')       //按c键拍照
        {
            sprintf(fileName, "Picture %d.jpg", ++count); //生成文件名
            cvSaveImage(fileName, pImg);
            cvXorS(pImg, cvScalarAll(255), pImg);         //将拍到的图像反色（闪一下形成拍照效果）
            cvShowImage("Camera",pImg);
            cvWaitKey(200); //反色图像显示ms
        }
        cvShowImage("Camera",pImg);
    }
    cvReleaseCapture(&cap);
    return 0;
}
```

#### 后记：

1. 实现图像反色（算法：对于RGB每个通道，255-原像素值）这一功能的时候，发现OpenCV没有自带的反色函数。于是想到了先用矩阵数乘，乘以-1，然后再用矩阵减法。后来发现貌似也没有数乘的函数（有吗？请知道的同学留言，谢谢。）

	Google了一下，发现网上给出的答案都很弱智，全部是两层循环，逐个像素操作。我了个去，这个不用你告诉我啊。。。

	最后还是在OpenCV的sample里发现了一个很好的解决方法。就是`cvXorS(pImg, cvScalarAll(255), pImg);`就是将每个像素值都异或255。255的二进制是11111111，对于8位整数来说，异或就是减法啊~Orz，这个思路。。。呵呵，我就知道这个问题可以用一句话解决，用不着自己写两层循环。。。

2. 为了图省事，我就直接用OpenCV自带的采集函数了。这个函数在Windows下使用的是VFW机制，效率非常低，自己照个相应该问题不大。但是要做产品的话还不够好，在Windows下最好用DirectShow来采集视频，OpenCV附带的videoInput静态链接库（在3rdparty下可以找到）封装了DirectShow的操作，使用很方便，具体的用法和范例程序可以参见我的[另一篇博文](/image-processing/using-videoinput-library-in-opencv/)
