---
title: OpenCV使用VideoInput库从摄像头捕获视频
date: 2010-07-11 22:50:13
tags:
categories: 绘云描鲤
---

OpenCV具有强大的图像处理功能，处理视频也是毫不逊色。只是其自带的HighGUI并非是具有工业强度的模块，不适合最终提供给客户，仅仅是方便程序开发阶段的调试。其中跟视频捕获相关的`cvCreateCameraCapture`或`cvCaptureFromCAM`函数可以方便的从摄像头捕获视频，但这两个函数在Windows中都是由较为低效的VFW机制实现的，不适合在最终产品中使用。

在Windows中使用DirectShow可以高效的从摄像头捕获视频，但使用较为复杂。OpenCV中文网的YuShiQi提供了一个基于DirectShow实现的摄像头捕获类，但试用后效果一般，速度并没有明显的提高。
新版的OpenCV（OpenCV 2.0及以后版本）提供了第三方的VideoInput库，该库实现了基于DirectShow的视频捕获，使用方便、功能强大，速度也很快。另外还有一个意外发现——腾讯QQ的视频捕获貌似用的也是这个库哦~~

<!--more-->

好了，下面就说说如何使用这个库
如果你的OpenCV版本低于2.0，请先去[http://muonics.net/school/spring05/videoInput/](http://muonics.net/school/spring05/videoInput/)
下载VideoInput，我这里需要翻墙才能上去。如果使用2.0及以后版本则自带该库。

首先需要在代码中包含VideoInput的头文件

```
#include <videoInput.h>
```

这个文件的默认路径是`C:\OpenCV2.1\3rdparty\include`
静态链接库的默认路径是`C:\OpenCV2.1\3rdparty\lib`
请先设置IDE中头文件和库文件的搜索路径。
 
下面给出一个读取并显示摄像头画面的实例

```
int width=320;
int height=240;
IplImage *pRgb=cvCreateImage(cvSize(width,height), IPL_DEPTH_8U, 3);
videoInput video;//创建视频捕获对象
video.setupDevice(0, width, height);//配置设备
video.showSettingsWindow(0);//该语句可以显示视频设置窗口，可以去掉
while(1)
{
   if(video.isFrameNew(0))
   {
        video.getPixels(0, (unsigned char *)pRgb->imageData, false, true);//获取一帧
        //cvFlip(pRgb,NULL,1);//加上这句就水平翻转画面
        char c=cvWaitKey(1);
        if(c==27) break;//按ESC退出
        cvShowImage(“Video”, pRgb);
   }
}
```
 
有朋友提出编译时可能会遇到如下错误：

```
"fatal error LNK1104: cannot open file 'atlthunk.lib'"
```

如果遇到此错误，请在文件的开头加入如下语句：

```
#pragma comment(linker, "/NODEFAULTLIB:atlthunk.lib")
```

这个类库还提供了非常强大的功能，具体函数可以查看videoInput.h头文件。下面附上videoInput类的共有成员函数列表和相关说明：

```
//turns off console messages - default is to print messages
static void setVerbose(bool _verbose);
 
//Functions in rough order they should be used.
static int listDevices(bool silent = false);
 
//needs to be called after listDevices - otherwise returns NULL
static char * getDeviceName(int deviceID);
 
//choose to use callback based capture - or single threaded
void setUseCallback(bool useCallback);
 
//call before setupDevice
//directshow will try and get the closest possible framerate to what is requested
void setIdealFramerate(int deviceID, int idealFramerate);
 
//some devices will stop delivering frames after a while - this method gives you the option to try and reconnect
//to a device if videoInput detects that a device has stopped delivering frames.
//you MUST CALL isFrameNew every app loop for this to have any effect
void setAutoReconnectOnFreeze(int deviceNumber, bool doReconnect, int numMissedFramesBeforeReconnect);
 
//Choose one of these four to setup your device
bool setupDevice(int deviceID);
bool setupDevice(int deviceID, int w, int h);
 
//These two are only for capture cards
//USB and Firewire cameras souldn't specify connection
bool setupDevice(int deviceID, int connection);
bool setupDevice(int deviceID, int w, int h, int connection);
 
//If you need to you can set your NTSC/PAL/SECAM
//preference here. if it is available it will be used.
//see #defines above for available formats - eg VI_NTSC_M or VI_PAL_B
//should be called after setupDevice
//can be called multiple times
bool setFormat(int deviceNumber, int format);
 
//Tells you when a new frame has arrived - you should call this if you have specified setAutoReconnectOnFreeze to true
bool isFrameNew(int deviceID);
 
bool isDeviceSetup(int deviceID);
   
//Returns the pixels - flipRedAndBlue toggles RGB/BGR flipping - and you can flip the image too
unsigned char * getPixels(int deviceID, bool flipRedAndBlue = true, bool flipImage = false);
 
//Or pass in a buffer for getPixels to fill returns true if successful.
bool getPixels(int id, unsigned char * pixels, bool flipRedAndBlue = true, bool flipImage = false);
 
//Launches a pop up settings window
//For some reason in GLUT you have to call it twice each time.
void showSettingsWindow(int deviceID);
 
//Manual control over settings thanks.....
//These are experimental for now.
bool setVideoSettingFilter(int deviceID, long Property, long lValue, long Flags = NULL, bool useDefaultValue = false);
bool setVideoSettingFilterPct(int deviceID, long Property, float pctValue, long Flags = NULL);
bool getVideoSettingFilter(int deviceID, long Property, long &min, long &max, long &SteppingDelta, long &currentValue, long &flags, long &defaultValue);
 
bool setVideoSettingCamera(int deviceID, long Property, long lValue, long Flags = NULL, bool useDefaultValue = false);
bool setVideoSettingCameraPct(int deviceID, long Property, float pctValue, long Flags = NULL);
bool getVideoSettingCamera(int deviceID, long Property, long &min, long &max, long &SteppingDelta, long &currentValue, long &flags, long &defaultValue);
 
//bool setVideoSettingCam(int deviceID, long Property, long lValue, long Flags = NULL, bool useDefaultValue = false);
 
//get width, height and number of pixels
int  getWidth(int deviceID);
int  getHeight(int deviceID);
int  getSize(int deviceID);
 
//completely stops and frees a device
void stopDevice(int deviceID);
 
//as above but then sets it up with same settings
bool restartDevice(int deviceID);
 
//number of devices available
int  devicesFound;
```
