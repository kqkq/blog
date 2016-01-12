---
title: Beginning iOS 5 Development阅读笔记
date: 2012-02-02 23:57:17
tags:
categories: 果粉手札
toc: true
---

2011年12月的新书，居然下到了电子版，之前打印的Beginning iPhone 4 Development貌似还没看几页就过时了。。。不过对比着读还是很不错的~

假期准备好好读读这本书，前两章是绪论和一些基础介绍，笔记就从第三章记起吧

<!--more-->

## 第三章 基础交互

类似于Hello world的一个程序

1. 意识到了Action中sender这个变量的作用，之前从来没用过这个变量的。。。

		lblShow.text = [NSString stringWithFormat:@"%@ button pressed.", [sender titleForState:UIControlStateNormal]];

	这里可以直接获得按下的那个按钮上面的文字
	
2. 在iOS 4中通常习惯用`alloc`分配一个新的`NSString`，`initWithFormat`后使用，然后用完再`release`，在上一个版本的书里都是这样写的。不过新版的书都将其改为了直接调用类方法`stringWithFormat`。我以为这是iOS 5的新函数，一查文档在iOS 2时就有了，不知道为啥现在才拿来用。网上的说法是，这个类方法也会申请内存，但是`autorelease`的，这样说来iOS 4也可以这样写嘛，可为什么到现在才改成这样呢？难道跟iOS 5的ARC有关么。。。
3. Product菜单中的Analyze命令可以分析并发现内存泄露等缺陷，貌似很好用，之前没发现。

## 第四章 控件大杂烩

1. 学会了一个常用的快捷键，`Command + =`，让控件大小适应内容。如果一个Label要显示长度会变的内容时，在设计界面时就先敲入可能的最长内容，然后按这个快捷键，控件的大小就刚好合适了。 
2. 按背景隐藏键盘，这个我之前的做法一直是插入一个透明的Custom按钮，放大到全屏，再加Action，还要调整层叠次序。这章介绍的方法是直接将视图的基类从默认的`UIView`改成`UIControl`，这样视图本身就可以响应事件了~太神奇了！而且超方便~
3. 为了节省资源，控件的Clip Subviews和Clears Graphics Context选项要关掉，Opaque选项不影响视觉效果的话能开就开
4. 之前不知道拖控件时穿过Text Box的那条参考线是什么意思，现在知道那叫Baseline guide，就是输入的文本的基线。类似于初中写作业用的凯撒牌英语本上的那条红线，哈哈
5. 提示信息用`UIAlertView`，里面不能放太多按钮。通过[alert show];显示。让用户选择用`UIActionSheet`，可以放多个按钮。通过`[actionSheet showInView:self.view];`显示。得到用户按了哪个按钮，都需要通过`delegate`。这种阻断程序，让用户做选择的东西统称modal view，貌似是翻译成“模态视图”
6. 继续体会到了`sender`的强大，功能类似的一组控件基本上都可以将事件响应写到一个Action响应的函数里，然后根据`sender`判断按了哪个。还有在`slider`滑动时的action中直接根据`sender`获得其`value`，而不需要为其建立专门的outlet。另外判别是哪个控件触发时，可以利用控件的`tag`字段
7. 可伸缩图片！！超实用的技巧！！设置不可伸缩部分（Cap），然后剩余部分就被自动拉长，填满控件。书上的代码还不太完善，他将`topCapHeight`设为了0，导致按钮很高时，两条水平的边缘变得很丑。我将`topCapHeight`也设为了12，大按钮看起来就很美观了。代码比较经典，直接贴上来备忘吧！用的时候别忘了把`Button`的类型从`Round Rect`改为`Custom`

		UIImage *imageNormal = [UIImage imageNamed:@"whiteButton.png"];
		UIImage *strhNormal = [imageNormal stretchableImageWithLeftCapWidth:12 topCapHeight:12];
		UIImage *imageHighlighted = [UIImage imageNamed:@"blueButton.png"];
		UIImage *strhHighlighted = [imageHighlighted stretchableImageWithLeftCapWidth:12 topCapHeight:12];
		[dosthButton setBackgroundImage:strhNormal forState:UIControlStateNormal];
		[dosthButton setBackgroundImage:strhHighlighted forState:UIControlStateHighlighted];

8. 在Action响应函数中，那些以Index标志的东西要加上注释，提高代码的可读性。比如`index`为0的segmented control是哪一个，比如ActionSheet中的第1个按钮是什么含义等等。

## 第五章 自动旋转

1. 先学学英语吧，protrait指的是竖屏（又高又窄），landscape指的是横屏（又矮又宽）
2. 建立一个iPhone工程，默认的Supported Device Orientations是除了“Upside down”以外的三个，而建立一个iPad工程时，默认则是支持全部的四个方向。这是为什么呢？因为iPhone在使用过程中面临突然有电话打进来的情况，用户没法在设备倒置的情况下打电话，因为话筒和听筒安装在电话的两端，没法混用，这就造成了不方便。而iPad则不存在电话和听筒位置的问题，所以默认是支持四个方向。一个细节而已，没啥用，就是挺吃惊的。
3. 支持多个方向最简单的方法是修改控件Autosizing的方式，图形化的界面，非常方便。但在复杂情况下不能满足需求，就要写代码手动调整控件的位置和大小。如果两个方向的界面相差很大，可以在一个Nib里建立两个View，分别制作好，通过代码切换这两个View。按Alt键拖动View在侧边栏里的条目可以复制View。
4. 通过`willAnimateRotationToInterfaceOrientation`响应设备旋转。这里涉及的技术稍微复杂一些，切换view只需要为View建立outlet并赋值给`self.view`，重要的是view的定位和方向。开始我没明白为什么要旋转，如果不明白的话，把给transform赋值的那几句话去掉，再运行一下看效果，你瞬间就会明白的！这里利用的是图形学中的旋转矩阵，当年学OpenGL生不如死的现在貌似用上了，一看那个先搞成单位矩阵，再搞仿射变换，瞬间感到一种亲切感！这段代码也挺经典的，以后可以直接拷贝来用，这里收藏一下。

		- (void)willAnimateRotationToInterfaceOrientation:(UIInterfaceOrientation) interfaceOrientation duration:(NSTimeInterval)duration {
		    if(interfaceOrientation == UIInterfaceOrientationPortrait)
		    {
		        self.view = self.portrait;
		        self.view.transform = CGAffineTransformIdentity;
		        //self.view.transform = CGAffineTransformMakeRotation(0);
		        self.view.bounds = CGRectMake(0.0, 0.0, 320.0, 460.0);
		    }
		    else if(interfaceOrientation == UIInterfaceOrientationLandscapeRight)
		    {
		        self.view = self.landscape;
		        self.view.transform = CGAffineTransformIdentity;
		        self.view.transform = CGAffineTransformMakeRotation(0.5 * M_PI);
		        self.view.bounds = CGRectMake(0.0, 0.0, 480, 300);
		    }
		    else if(interfaceOrientation == UIInterfaceOrientationLandscapeLeft)
		    {
		        self.view = self.landscape;
		        self.view.transform = CGAffineTransformIdentity;
		        self.view.transform = CGAffineTransformMakeRotation(-0.5 * M_PI);
		        self.view.bounds = CGRectMake(0.0, 0.0, 480, 300);
		    }
		}

	需要注意的有：
	
	* 仿射变换的参数是弧度制，不是角度制
	* RectMake的时候要考虑状态栏的高度
	* 直立状态时也要为transform赋值，将界面转回正常，否则开始运行时是正确的，横过来再竖过来就错了
	
5. iOS的新特性outlet collection，Outlet具有一对一的特点，一个Outlet只能对应一个控件，一个控件对应多个Outlet也没有意义。为了能让一个Outlet控制多个控件，新版iOS（据说是iOS 4引入的？不过在这本新版iOS 5的书上才讲到，上一个版本的书没讲）引入了Outlet Collection这个概念，想建立控件-Outlet多对一的关系时，可以创建Outlet Collection，它实际上就是一个Outlet的数组，类型是NSArray。可以用for...in循环来遍历，用containsObject实例方法来查找。

	下面代码展示了将一个Outlet Collection中所有的控件的属性全部改变的循环

		if([tops containsObject:sender]){
		    msg = @"Top button pressed.";
		    for(UIButton *btn in tops){
		        btn.hidden = YES;
		    }
		}

6. 一个新的关键词，`strong`，没懂啥意思，后来在StackOverflow上搜到了一个很好的解释

	>It's a replacement for the retain attribute, as part of Objective-C Automated Reference Counting (ARC). In non-ARC code it's just a synonym for retain.

	我就来翻译一下吧：它作为Objective-C自动引用计数(ARC)的一部分，用来替换`retain`修饰符。在非ARC代码中，它就是`retain`的同义词。

## 第六章 多视图应用

很长的一章，代码挺多的，第一次从空工程构建出一个App。。。

1. 在AppDelegate里加载第一个ViewController的时候要计算status bar的高度。但是直接建出的工程就没有这个步骤，不知道为啥。。。计算的代码是

		self.window = [[[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]] autorelease];
		SwitchViewController *switchController = [[SwitchViewController alloc] initWithNibName:@"SwitchView" bundle:nil];
		self.switchViewController = switchController;
		UIView *switchView = self.switchViewController.view;
		CGRect frame = switchView.frame;
		frame.origin.y += [UIApplication sharedApplication].statusBarFrame.size.height;
		switchView.frame = frame;
		[self.window addSubview:switchView];
		self.window.backgroundColor = [UIColor whiteColor];
		[self.window makeKeyAndVisible];
		[switchController release];
		return YES;

2. 这里再说一下内存管理吧。。。到第六章才意识到这个问题显然有点晚。通过这本书新旧两个版本的比较阅读，我发现最大的区别就是内存管理。由于ARC的引入，前面版本里跟内存管理有关的讲解和代码在新版里消失的无影无踪，之前各种经典的内存泄露在新版里则成为了范例代码。这些代码搬到iOS 4可以用肆无忌惮来形容，哈哈！不过iOS 5不会那么快的普及，因此我们还是应该了解iOS在内存管理方面的特点，避免内存泄露。就拿上面的那段代码来说，要注意的是

		SwitchViewController *switchController = [[SwitchViewController alloc] initWithNibName:@"SwitchView" bundle:nil];
		self.switchViewController = switchController;

	C++用户可能会疑惑，为什么要switchController这个指针多此一举呢？下面这样一句话解决不行吗?

		self.switchViewController = [[SwitchViewController alloc] initWithNibName:@"SwitchView" bundle:nil];

	这是Objective-C的特性决定的，属性`switchViewController`是由`retain`修饰的，即对赋值操作自己持有一个副本。这样alloc出来的对象占用一块内存，属性`switchViewController`由于持有该对象就再占用一块内存。类析构时只能释放后者，而前者则泄露。因此在OC里，如果不开ARC，那么那个临时的指针变量以及随后的`release`语句就是必须的了。
	
3. 分别建立nib和代码文件时，需要建立两者的联系。需要做的有：
	* 点nib里的File‘s owner，设置其Custom Class为其Controller类的名字
	*  将View与File's owner里的view建立outlet。这两项做完就可以在Assistant界面上拖Outlet和Action了

4. 一点疑问，书上说superview有status bar了，那么subview就不应该设置status bar，这样系统才能正确计算出尺寸。我实验中恰好相反，在subview里加上了status bar，显示出的控件位置才跟Interface Builder里的一样。
5. 视图切换的动画。AnimationCurve的概念，Animation block的概念。

## 第七章 TabBar和DataPicker

1. 学会了如何手动从空工程建立Tabbed Application。可以直接在AppDelegate里载入TabBar View Controller的xib，代码只要在`didFinishLaunchingWithOptions`方法中加两行

		[[NSBundle mainBundle] loadNibNamed:@"TabBarController" owner:self options:nil];
		[self.window addSubview:rootController.view];

	当然别忘了把xib中File's owner的Class改成AppDelegate，还有将TabBar Controller与手动敲的`@property (strong, nonatomic) IBOutlet UITabBarController *rootController;`建立outlet连接
	
2. Tab中每个Item除了图标和Title之外还要改两处
	* Custom Class
	* Nib Name
都改成要载入的那个View的类名和xib名
3. Picker里最常用的一个方法是`selectedRowInComponent`
4. Picker的两个协议（代理和数据源）中，必须要实现的方法有3个
	* `- (NSInteger) numberOfComponentsInPickerView:(UIPickerView *)pickerView`
	* `- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component`
	* `- (NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component`
	* `- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view`
	
	最后两个可以选一个实现。可选的方法是：
	
	* `- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component`
	
	必选的三个方法记忆方法就是2个`NSInteger`和一个`NSString*`，只有记住第一个括号，然后敲Esc补全就可以了。还跟新浪网院的老师学了个歪招，就是按住`Command`键，点头文件里的协议名，看协议的声明，然后复制协议方法的原型到自己的代码中。
5. 用`NSDate *selected = [datePicker date];`获取Date Picker的日期数据，但返回的是中央时区的时间，貌似还需要Format。这里犯过一个低级错误，就是把`NSDate`写成了`NSData`，不仅能过编译，而且还能正常运行！只是这句话上一直有警告。端详了老半天才发现一个字母的差异。。。
6. Double Picker那个View写起来明显熟练了很多，基本上没出啥问题，书瞄上一眼就能自己写出来。
7. plist读进来是一个`Dictionary`，用`valueForKey`方法查找
8. 如果picker的component之间有依赖关系，需要在`didSelectRow`协议方法中调用picker的`reloadComponent`方法来重新载入需要改变的component，或者直接`reloadAllComponent`。。。
9. picker有多个component时，可以把每一列的编号define成一个宏常量，这样判断时就可以用有意义的字符串代替编号，提高代码的可读性
10. 通过widthForComponent方法可以指定列宽，从而形成各个component不等宽的效果，如果几个Component数据长度差异较大，可以考虑实现这个方法。看书上的代码，各个component的宽度之和为290个像素。另外还有一个指定每行高度的方法叫`rowHeightForComponent`，还没用过。
11. 一些需要收藏备用的代码
	* 用代码选定picker中的某一行`[picker selectRow:0 inComponent:kZipComponent animated:YES];`
	* 上一条的逆操作，即得到现在选中了哪一行`[picker selectedRowInComponent:kStateComponent]`
	* 对`NSArray`排序（实例名为`sorted`）`sorted = [sorted sortedArrayUsingSelector:@selector(compare:)];`
	* 获取资源的`NSURL`：`NSURL *resURL = [[NSBundle mainBundle] URLForResource:@"文件名" withExtension:@"扩展名"];`
	* 通过`NSURL`将PList读入到`NSDictionary`：`NSDictionary *dict = [[NSDictionary alloc] initWithContentsOfURL:resURL];`
	* 从资源中载入图片`UIImage *seven = [UIImage imageNamed:@"seven.png"];`
	* 动态的通过属性的名称为其赋值`[self setValue:新的值 forKey:本类中的属性名];`
	* 延迟一会儿再调用某个方法：`[self performSelector:@selector(要调用的方法名) withObject:nil afterDelay: 0.5];`想不到SDK里居然有这种奇葩的函数。延迟的单位是秒。对另一个函数的调用是同步的，也就是说如果被调的函数执行时间很长，那这样调用仍然会卡住UI线程
	* 播放声音

			NSURL *soundURL = [[NSBundle mainBundle] URLForResource:@"声音文件名" withExtension:@"wav"];
			SystemSoundID soundID;
			AudioServicesCreateSystemSoundID((__bridge CFURLRef)soundURL, &soundID); 
			AudioServicesPlaySystemSound(soundID);

	那个斜体的__bridge是给ARC看的，iOS4中不用加。使用这些代码需要加头文件`#import <AudioToolbox/AudioToolbox.h>`，当然还需加框架`AudioToolbox`~，还记得作为一名文艺青年应该怎么加框架吗？

	重要提示：通过与iOS4旧版图书的比较阅读，发现以上播放声音的代码在没有ARC的时候会导致内存泄露！在没有ARC的情况下，正确的做法是将`SystemSoundID`作为类的一个属性，在视图载入时就调用`AudioServicesCreateSystemSoundID`方法创建`SoundID`，在视图退出时调用`AudioServicesDisposeSystemSoundID(soundID);`方法释放。奇葩的是，`SoundID`不能在播放的函数里释放，`SoundID`必须在播放期间都有效。否则会放不出声音。不这样释放的话，在声音被反复打开时就会出现内存泄露。还有，`SoundID`貌似一个类，其实就是一个无符号长整型数。

终于读完了这一章！！！好长

## 第八章 TableView初步

1. 还是说说内存管理吧。`self.XXX = YYY;`跟`XXX = YYY;`其中`XXX`是声明为`retain`的属性。这两种写法是不一样的。前者会发挥`retain`的作用，而后者直接给指针赋值。如果你随后又将`YYY`给`release`了的话，那第二种写法就会出错，必须使用第一种。还有，在读取一个属性的时候，加不加`self`是没区别的~
2. 这一章有以下后续内容，暂时用不到，以后再看吧：
	- 右侧的索引条
	- 基于Category(分类)的深拷贝
	- 搜索栏

## 第十一章 定位服务（LBS）

1. Core Location框架使用很方便，经纬度、海拔、精度、旅行距离都能直接测出来
2. 编译的时候要加上CoreLocation.framework，加这个框架有3三种方法
	* 普通青年：在原有的框架比如UIKit.framework点右键，在打开的文件夹里找到CoreLocation.framework，然后拖进Xcode里，在向导里点确定
	* 文艺青年：在项目设置的页面点Build Phase，在Link Binary with Libraries下面点加号，选CoreLocation.framework加进来
	* 2B青年：在项目上右键，Add files to “XXX”，然后依次展开`/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS5.0.sdk/System/Library/Frameworks/`找到`CoreLocation.framework`加进来

	话说我就是差点成了2B青年，最后用普通青年的方法加进来的，书上介绍的方法属于文艺青年~哈哈哈
3. 程序的代码也是比较固定，可以直接粘贴到需要定位的项目里用，这里也贴上来收藏。头文件如下，需要加的有1头文件，2协议，3需要的Outlet

		#import <UIKit/UIKit.h>
		#import <CoreLocation/CoreLocation.h>
		@interface FirstViewController : UIViewController<CLLocationManagerDelegate>
		@property (retain, nonatomic) CLLocationManager *locManager;
		@property (retain, nonatomic) CLLocation *startPoint;
		@property (retain, nonatomic) IBOutlet UILabel *lblLatitude;
		@property (retain, nonatomic) IBOutlet UILabel *lblLongitude;
		@property (retain, nonatomic) IBOutlet UILabel *lblHorAccu;
		@property (retain, nonatomic) IBOutlet UILabel *lblAltitude;
		@property (retain, nonatomic) IBOutlet UILabel *lblVerAccu;
		@property (retain, nonatomic) IBOutlet UILabel *lblDistance;
		@end

	实现文件中，视图载入后初始化CLLocationManager、设定精度、更新位置信息，这是定位最核心的代码，却非常简洁
	
		- (void)viewDidLoad
		{
		    [super viewDidLoad];
		    locManager = [[CLLocationManager alloc] init];
		    locManager.delegate = self;
		    locManager.desiredAccuracy = kCLLocationAccuracyBest;
		    [locManager startUpdatingLocation];
		}

	每次更新得到新的坐标后，就会调用这个方法。坐标啥的都在newLocation里了，直接拿来用就行。还有别忘了处理一下错误，如果用户没有授权获取位置信息，那就要做相应的处理。

		#pragma mark - CLLocationManagerDelegate Methods
		- (void)locationManager:(CLLocationManager *)manager 
		    didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
		    NSString *latitudeString = [NSString stringWithFormat:@"%g\°", newLocation.coordinate.latitude];
		    lblLatitude.text = latitudeString;
		    NSString *longitudeString = [NSString stringWithFormat:@"%g\°", newLocation.coordinate.longitude];
		    lblLongitude.text = longitudeString;
		    NSString *horizontalAccuracyString = [NSString stringWithFormat:@"%gm", newLocation.horizontalAccuracy];
		    lblHorAccu.text = horizontalAccuracyString;
		    NSString *altitudeString = [NSString stringWithFormat:@"%gm", newLocation.altitude];
		    lblAltitude.text = altitudeString;
		    NSString *verticalAccuracyString = [NSString stringWithFormat:@"%gm", newLocation.verticalAccuracy];
		    lblVerAccu.text = verticalAccuracyString;
		    CLLocationDistance distance = [newLocation distanceFromLocation:startPoint];
		    NSString *distanceString = [NSString stringWithFormat:@"%gm", distance];
		    lblDistance.text = distanceString;
		}
		
		- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
		    NSString *errorType = (error.code == kCLErrorDenied) ? @"Access Denied" : @"Unknown Error";
		    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error getting Location" message:errorType delegate:self cancelButtonTitle:@"Okay" otherButtonTitles:nil];
		    [alert show]; 
		}
