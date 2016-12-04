---
title: "LeetCode 014 Longest Common Prefix 题解"
date: 2015-07-09 15:58:37
categories: 编程之美
---

## 题意

给一堆字符串，求这一堆字符串的*最长公共前缀*。

<!--more-->

## 分析

这个题目比较简单，读了几遍题才确定确实是如此简单。最长公共前缀，意味着起点就固定在第一个字符，所以就依次检测所有字符串的第2个、第3个字符……直到有某个字符串的下一个字符与别人不同为止。

C代码：

```c
char* longestCommonPrefix(char** strs, int strsSize) {
    char c;
    int n = 0;
    if(strsSize == 0) return "";
    for(int i = 0; ; i++) // H
    {
        int j;
        c = strs[0][i];
        if(c == 0) break;
        for(j = 0; j < strsSize; j++) // V
        {
            if(c != strs[j][i]) break;
        }
        if(j != strsSize) break;
        else n++;
    }
    strs[0][n] = 0;
    return strs[0];
}
```

需要特别判断的是输入字符串为空，则返回空字符串`""`。外层循环是横向指针，指到每个字符串的第几个字符。内层循环是纵向指针，在不同字符串的同一个位置间跳转。内层循环之前将下一个公共字符初始化为第一个字符串的下一次字符，注意判断字符串的结尾即可。