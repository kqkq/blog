---
title: 基于51单片机的四路抢答器
date: 2014-03-20 00:51:57
---

开头先抱怨一下这个该死的期末作业！话说想杀死一个程序员不需要用刀，只需要改3次需求就可以了……本来没打算用单片机做的，后来又要求加入犯规判断和超时判断，不用单片机的电路越改越复杂。终于，在得知核心芯片74116无货之后，之前的设计被全部推翻，一切从零开始。

不想再纠结于复杂的锁存器和门电路，决定用单片机来实现这个抢答器。

此抢答器具有限时抢答，超时无效的特点，并可以对主持人未喊开始而提前抢答的犯规情况作出判断。

由于用了单片机，所以电路很简单。懒得写译码程序，也不想做驱动电路。干脆直接用了一片74LS48译码驱动器来驱动数码管。

![][schematic]
 
呵呵，面包板上插一下，由于之前在Proteus中仿真过，所以直接就正常运行了~上一张实物图

左边的是STC89C52的最小系统版，P1口上接了8个LED，当时做流水灯的。直接拿来用了。P2口是显示输出，P3口接受按键。那个小的芯片就是74LS48啦~下方的是编程器+电源，STC的芯片就是编程方便，支持在线烧写，这么小巧的编程器~

![][responder]

当然最重要的是程序，附上代码清单。写的比较烂，竟然上了100行，希望不要被大虾们骂得太惨>_<

```
#include <reg52.h>
#define uint unsigned char

//计时变量
uint s = 0, ms = 0;

//枚举类型：记录抢答器工作状态
enum Stat
{
    Idle = 0,    //空闲状态，比如正在读题
    Ready = 1,   //就绪状态，可以抢答
    Respond = 2, //响应状态，有人抢到了
}stat;

//时钟中断服务程序
void Timer() interrupt 1 using 1
{
    TH0=0x3C;
    TL0=0xBD;
    ms ++;
    s += ms /20;
    ms %= 20;
    s %= 60;
}

//重置时钟
void ResetTimer()
{
    EA = 1;   //允许CPU 中断
    ET0 = 1;  //定时器中断打开
    TMOD = 1; //设定时器为方式
    TR0 = 0;  //关定时器
    ms = 0;
    s = 0;
}

//优先编码(反向输入)
uint Encode(uint c)
{
    uint i, mask = 1;
    if(c == 0) return 0;
    for(i = 0; i < 8; i++)
    {
        if((c & (mask << i)) == 0) return i + 1;
    }
}


void main()
{
    uint led = 0xff; //对应P1口，指示灯
    uint disp = 15;  //对应P2口，数码管
    uint button;     //对应P3口，按键
    uint isFoul = 0; //是否犯规（或超时）
  const uint timeout = 5; //超时时间
  ResetTimer();
    while(1)
    {
        //设置状态指示灯，用于调试，实际应用中可以去掉
        if(stat == Idle) P0 = (~1);
        else if(stat == Ready) P0 = (~2);
        else if(stat == Respond) P0 = (~4);
        else stat = 0;

        //超时判断
        if(timeout - s == 0)
        {
            isFoul = 1;
            disp = 15;
            stat = Idle;
            ResetTimer();
        } 

        //读按键
        button = P3;

        //P3.5复位键按下
        if((button & 32) == 0)
        {
            disp = 15;
            led = 0xff;
            stat = Idle;
            isFoul = 0;
            ResetTimer();
        } 

        //P3.4开始键按下
        if((button & 16) == 0)
        {
            stat = Ready;
            P1 = 0;  //所有选手的灯闪烁，提示可以开始抢答
            TR0 = 1; //开始计时
        } 

        //P3.0-P3.3抢答键按下
        if((button & 15) != 15)
        {
            if(stat == Idle) isFoul = 1; //提前抢，犯规
            if(stat != Respond)          //正常抢答
            {
                led = (button & 15) + 240;
                disp = Encode(button & 15);
                stat = Respond;
            }
            ResetTimer();
        } 

        //显示
        if(isFoul) led &= 127; //犯规则点亮
        if(stat == Ready) disp = timeout - s;
        P1 = led;
        P2 = disp;
    }
}
```

[schematic]: /images/8051-responder-1.png
[responder]: /images/8051-responder-2.jpg