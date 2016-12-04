---
title: "LeetCode 191 Number of 1 Bits 题解"
date: 2015-07-09 17:29:46
categories: 编程之美
---

## 题意

求一个整数的二进制中1的个数。例如32位整数11的二进制为`00000000000000000000000000001011`，共有3个1，所以返回3.

<!--more-->

## 分析

利用位运算`n & (n - 1)`消去最后一个1，直到整数为零为止。这个位运算的具体解释请参见[231题：Power of Two](../leetcode-power-of-two/). 直接上代码了。

C代码：

```c
int hammingWeight(uint32_t n) {
    int sum = 1;
    if(n == 0) return 0;
    while(n = (n & (n - 1))) sum++;
    return sum;
}
```

`sum`要初始化为1，因为最后一个1被消掉时`while`循环是进不去的，所以少累加了一次，要补上。输入0时，循环也进不去，但要返回0，这里要特别判定一下。另外附上讨论区里面给的一个非常神棍而变态的无循环版的位运算解法，耗时跟我的解法一样，都是4ms。

```c
int hammingWeight(uint32_t n)
{
	unsigned int c; 
	c =  ((n & 0xfff) * 0x1001001001001ULL & 0x84210842108421ULL) % 0x1f;
	c += (((n & 0xfff000) >> 12) * 0x1001001001001ULL & 0x84210842108421ULL) % 0x1f;
	c += ((n >> 24) * 0x1001001001001ULL & 0x84210842108421ULL) % 0x1f;
	return c;
}
```

这个解法大家看看热闹就好~