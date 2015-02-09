title: 如何在嵌入式C++开发中缩减代码尺寸
date: 2013-02-08 00:27:14
tags:
categories: 软硬兼施
toc: true
---

最近在做的一项工作是将Arduino Due的类库移植到STM32上，Arduino经过多年的积累，类库已经比较完善了，其中也不乏一些C++的高级或者动态特性。比如虚函数和抽象类、动态存储分配、函数和运算符重载等等。

一直以来，C++是否适用于资源极其有限的嵌入式系统就是一个备受争议的问题。实际应用中，我也确实遇到了诸多的问题。其中最突出的就是代码尺寸的问题。我选用的ARM单片机有64KB的Flash和20KB的SRAM空间，这在8051时代已经是高端大气上档次的豪华配置了，但当我们用C++编译器编译一下那些用C++写成的简单到不能再简单的代码，就会发现这点Flash空间简直就是战斗力只有五的渣渣。。。

正是由于这种现象，我最近几乎只能花一半的时间编程序，而另外的一半时间却要来设法缩减代码的尺寸。因为在最初的时候，一个闪烁LED并在串口输出一个字符串的程序就需要100K的Flash空间，实在是难以置信。

<!--more-->

在此之前，我一直自认为可以熟练的使用GNU工具链进行高效的程序开发，虽然vim水平被大牛耻笑，但也偶尔可以耻笑别人。。。退一步说，至少可以耻笑编译器和编辑器都不能区分的初学者~然而在开源工具链方面的经验却在嵌入式开发中翻了车，极度膨胀的代码尺寸着实让我这个嵌入式新手挠头。

经过一周的研究，我也逐渐明白了嵌入式C++开发中代码膨胀的主要原因，以及缩减代码尺寸的一些重要技巧。

为了缩减嵌入式C++的代码，我们必须先要了解为什么一个极为简单的C++程序的代码会这么大。编译原理告诉我们的东西似乎不太够，因为我们写的那些代码根本不可能编译成那么大的目标代码，我们需要知道，C++编译器除了编译了我们写的代码，还在背后干了什么。

原来，C/C++作为一个具有工业强度的编程语言，除了我们在每本书上都能学到丰富的语言特性之外，还提供了具有极高效率、极佳健壮性和鲁棒性的底层类库。然而使用功能强大、容错性好且执行高效的代码是有代价的，那就是代码尺寸的膨胀。目前我们能够得到的绝大部分标准库，都将效率和健壮性作为设计时的主要考虑，而对代码尺寸则没有特别的追求。这也使标准库中的一些函数过于臃肿。例如最常用的`printf`和`scanf`函数，支持字节型、整形、浮点型等各种类型的格式化输入输出，十分方便。然而使用newlib中的printf函数将会占用37KB的Flash和5KB的SRAM空间，这对绝大多数Cortex-M系列的单片机来说都是不可接受的。

另外，C++还提供的异常(exception)、运行时类型识别(RTTI)以及动态存储分配机制，这些机制是C++的语言特性，但是却是通过库函数实现的。这些特性的使用，会引入stdc++标准类库中的大量基础函数，这些函数在连接时通过连接器添加到目标代码中，是导致C++代码膨胀的重要原因。

我自己在之前对语言特性的理解一直是与库函数割裂开的。我之前的理解是：语言特性表现在关键字和表达式上，比如C++支持`class`、`virtual`、`new`、`delete`这些关键字，是语言本身的，仅仅与编译器有关的。C++里可以用`new`分配内存，是因为C++编译器认识这个关键字。而库函数就是比如`strcpy`、`strlen`之类，是与语言无关的。我可以自己写一个`strlen`，甚至可以用C#、Java等不同的语言来写。而我却不能为C++添加一个关键字，如果硬要加，只能改编译器。

但事实上这个理解是不准确的，C++的关键字不仅与编译器有关，也与标准库有关。这其实并不难理解，我们可以在C语言中用`malloc()`函数分配一片内存，这个函数后面对应了C标准库中的一大段代码，我们也是可以想象的。那当我们在C++中使用`new`分配内存时，`new`关键字的背后一定也对应了功能类似的一大段代码（实际上更加复杂的一段代码，因为`new`支持异常），那`new`对应的这段代码来自哪里呢？是编译器吗？显然不是。它来自C++的标准库。举个例子，`goto`关键字会被编译器直接编译成一个jmp指令，但`new`关键字则会被编译成一个函数调用，要调用的代码则在连接阶段，被连接器从标准库中揪过来。

明白了这些原理，我们就可以整理一下缩减嵌入式C++代码尺寸的一些思路了。Good design demands good compromises. 为了让C++更符合嵌入式系统的实际情境，我们需要放弃或者简化以上提到的很多特性，并通过编译参数的设置、优化掉不需要的代码，从而达到缩减代码尺寸的目的。

在正式开始介绍之前，先向各位同仁强烈推荐[这篇文章](http://elegantinvention.com/blog/information/smaller-binary-size-with-c-on-baremetal-g/)，本文的部分内容会翻译这篇文章。[另一篇文章](http://www.webalice.it/fede.tft/cpp_on_microcontrollers_tricks/cpp_on_microcontrollers_tricks.html)也针C++在嵌入式情境中的应用提出了有益的建议。ARM官方的[一篇博文](http://blogs.arm.com/embedded/879-shrink-your-mcu-code-size-with-gcc-arm-embedded-47/)对编译器和库函数的优化进行了简单的阐述。

关于GCC配置参数的优化，主要参考了ARM GCC 2012q4的文档和readme。当然本文还包含一些我自己的理解以及上述文章中没提到的一些技巧。

## 回收未被调用的函数和数据所占用的空间

在嵌入式编程中，我们通常会使用MCU厂商提供的外设驱动库来避免直接对寄存器进行操作，驱动库通常是被整个包含进来的，而我们可能只用到了其中很少的几个函数。因此回收未被调用的函数所占用的空间就很有必要了。通过为连接器传递`--gc-sections`参数（通常是用`-Wl,--gc-sections`）可以令连接器回收未被使用的section。但一个section可能会包含很多个函数，所以单独使用这个参数可能还不能取得最好的效果。另外为编译器加上`-ffunction-sections`和`-fdata-sections`两个参数，可以强制编译器为每个函数和数据分配独立的section，这样每个冗余的函数都可以独立的被回收了。

在使用C++标准库函数时，这个技巧尤为重要。因为C++标准库在编译时都已经使用了`-ffunction-sections`参数，所以这个技巧可以非常显著的缩减C++程序的尺寸。

## 禁用C++的异常机制

异常的捕获和处理需要大量的代码，默认情况下这些代码都会编译到目标文件中。如果不需要使用异常机制，可以在编译阶段禁用它们。禁用异常的编译参数是`-fno-exceptions`

## 禁用C++的运行时类型识别(RTTI)机制

运行时类型信息是很有爱的~它允许我们在运行时根据代码的具体情况进行更安全的类型转换。如果禁用这个机制，我们将不能使用`dynamic_cast<>()`和`typeid()`。有趣的是，由RTTI增加的代码是比较少的（不到1KB），所以通常我们可以不用担心这点空间。如果一定要禁用这个机制，方法是添加编译参数`-fno-rtti`

## 重载new和delete运算符

默认的`new`和`delete`运算符在堆(heap)空间不足时会抛出`std::bad_alloc`异常。这意味着，即使使用了`-fno-exceptions`参数，在我们使用new分配内存的时候仍能看到代码的尺寸显著增大。

好在重载`new`和`delete`的方法很简单，也许我们更希望通过自己实现的调试代码来捕获内存分配时出现的错误。自己实现的调试跟踪代码，有几种方法，比如通过USART串口将错误返回到PC机，或者利用支持semihosting的仿真器来获得错误信息。下面就给出自己实现`new`和`delete`的样例代码。出处在[http://pastebin.com/7VKUuTJa](http://pastebin.com/7VKUuTJa)

该网址貌似需要翻墙才能访问，为方便国内的朋友，我就把代码粘过来了

更新：笔者使用这个版本的重载时，代码尺寸不降反增，因此这个技巧的有效性还请大家验证。

```
/* tinynew.cpp
   
   Overrides operators new and delete
   globally to reduce code size.
   
   Public domain, use however you wish.
   If you really need a license, consider it MIT:
   http://www.opensource.org/licenses/mit-license.php
   
   - Eric Agan
     Elegant Invention
 */

#include <new>
#include <malloc.h>

void* operator new(std::size_t size) {
    return malloc(size);
}

void* operator new[](std::size_t size) {
    return malloc(size);
}

void operator delete(void* ptr) {
    free(ptr);
}

void operator delete[](void* ptr) {
    free(ptr);
}

/* Optionally you can override the 'nothrow' versions as well.
   This is useful if you want to catch failed allocs with your
   own debug code, or keep track of heap usage for example,
   rather than just eliminate exceptions.
 */

void* operator new(std::size_t size, const std::nothrow_t&) {
    return malloc(size);
}

void* operator new[](std::size_t size, const std::nothrow_t&) {
    return malloc(size);
}

void operator delete(void* ptr, const std::nothrow_t&) {
    free(ptr);
}

void operator delete[](void* ptr, const std::nothrow_t&) {
    free(ptr);
}

//eof
```

## 给出一个`__cxa_pure_virtual()`的实现

如果我们在代码的任何位置使用了纯虚函数，即使已经使用`-fno-exceptions`禁用了异常，我们仍能发现代码尺寸显著的增加了（大概会增大40KB！！！）

我碰到了这种现象并且花了很久的时间去跟踪。当我们查看目标代码的反汇编代码清单时（通过`objdump -h -C -S`导出），我们会发现貌似异常处理的代码又回来了。。。

为了搞明白到底是什么东西这么大，我尝试使用`-nostdlib`连接参数，这会禁用整个的C++标准库（libstdc++），然后我提供了内容为空的`malloc`、`realloc`、`free`等我们常用的标准库函数，最后g++报错的是一个我从没听说过的东西：`__cxa_pure_virtual()`

“哈哈”，我想，“一定就是这个东西！”。通过查看该函数的[源代码](http://gcc.gnu.org/svn/gcc/tags/gcc_4_4_3_release/libstdc++-v3/libsupc++/pure.cc)。这个网址是GNU官方的，给出的代码正是这个函数在GNU C++标准库中的开源实现。我们本地的标准库是经过预编译的，所以这个代码在本地是看不到的，我们发现这个函数调用了`std::terminate()`，这个（跟异常机制有关）调用将我们那点可怜的Flash蚕食殆尽，完全将白纸黑字的`-fno-exceptions`爆出翔~

实际上，当我调用一个纯虚函数时（纯虚函数不能被调用，因为纯虚函数没有实现），系统就会帮我们调用`__cxa_pure_virtual()`，从而使程序报错。跟`new`和`delete`一样，我们也希望通过自己实现的调试跟踪代码来获得有意义的反馈。这个实现很简单粗暴，需要注意的是要添加`extern "C"`，以防止函数名被修饰（Mangling）。关于C++的函数名修饰，请详见[维基百科相关条目](http://en.wikipedia.org/wiki/Name_mangling)

具体实现如下：

```
extern "C" void __cxa_pure_virtual() { while(1); }
```

## 重载标准库的异常处理函数

当我们使用异常机制时，代码尺寸会暴增，导致这一现象的原因则是C++标准库提供的冗长的异常处理函数。当有未捕获的异常时，这个函数就会被调用。这个函数做的事情仅仅是打印出发生异常的函数名，但是却需要对函数名进行重组（demangle），而重组函数名的代码是非常复杂的。要如果确实需要异常机制，我们可以重载C++提供的冗长的异常处理函数，代码如下

```
namespace __gnu_cxx
{
    void __verbose_terminate_handler()
    {
        abort();
    }
}
```

这个函数必须不能返回，这里简单的终止了程序，我们也可以在里面添加一些别的操作，比如在串口上输出一个错误信息，然后进入一个死循环等等。重点是，通过重新定义这个函数，我们阻止了原始版本的实现被连接到目标代码中，从而显著减小了目标代码的尺寸。

## 给出一个`_init`的实现并使用`-fno-use-cxa-atexit`编译参数和`-nostartfiles`连接参数

一般情况下，芯片厂商提供的example中会包含芯片的启动代码(Startup code)，这样我们就没有必要使用系统库提供的初始化程序，我们给出一个空的`_init`实现

```
extern "C" void _init(void){}
```

另外，我们还可以使用`-fno-use-cxa-atexit`来去掉编译时自动加上的一些异常处理函数

至此，程序对标准库的移动和异常处理的依赖被全部解除，我们可以在连接时使用`-nostartfiles`来避免连接标准库相关的代码。

## 使用高版本的编译器和精简版的标准库

截止到本文成文时，ARM GCC工具链的最新版本是2012q4，其中包含了GCC 4.7.2. 这个版本的GCC包含了更高级的代码优化技术，在使用-Os优化参数时，生成的目标代码比之前的版本小2%

更重要的是，这个版本的工具链还附带了专门为嵌入式应用而优化的C标准库——Newlib-nano。其中提供了精简版的`printf`和`scanf`（默认情况下不支持浮点数，但可以通过编译参数开启），以及更适用于嵌入式环境（小内存）的`memset`、`malloc`等内存管理函数。这些函数占用的代码空间只有传统标准库的六分之一。Newlib-nano使用了`-fno-exception`参数进行编译，且优化设置为`-Os`

根据ARM官方博客的介绍，使用精简版的标准库编写的Hello world程序中，代码尺寸缩减了80%，而在极端案例中的缩减会超过90%

要下载新版的工具链，可以前往ARM GCC的[项目主页](https://launchpad.net/gcc-arm-embedded/)
