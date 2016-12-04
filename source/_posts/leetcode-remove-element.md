---
title: "LeetCode 027 Remove Element 题解"
date: 2015-07-09 17:02:12
categories: 编程之美
---

## 题意

给一个字符串，要求就地（in-place）移除其中所有值为`val`的元素，返回新字符串长度。大于该长度的空间内的内容不影响题目判定。

<!--more-->

## 分析

题目思路比较简单，用两个指针一个指向当前字符，一个指向最后一个字符。左边指针不断右移，右边指针不断左移。题目的细节比较多，比如要确保`tail`指针指向的值不为`val`。再就是不断地检查当前值，若为`val`则将其移向队尾。

C代码：

```c
int fixTail(int *nums, int tail, int val)
{
    while(nums[tail] == val)
    {
        tail--;
        if(tail == -1) return -1;
    }
    return tail;
}
int removeElement(int* nums, int numsSize, int val) {
    if(numsSize == 0) return 0;
    int head = 0, tail = fixTail(nums, numsSize - 1, val);
    if(tail == -1) return 0;
    while(head <= tail)
    {
        if(nums[head] == val)
        {
            int tmp = nums[tail];
            nums[tail] = nums[head];
            nums[head] = tmp;
            tail = fixTail(nums, tail, val);
        }
        head++;
    }
    return tail + 1;
}
```

`fixTail`函数用于处理`tail`指针，确保其指向的值不为`val`.另外需要判定一些长度为0的情况。