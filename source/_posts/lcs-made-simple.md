---
title: "最长公共子序列（LCS）问题完全解析"
date: 2015-08-01 00:00:00
categories: 编程之美
math: true
toc: true
---

## 问题描述

给定两个字符串，输出两个串最长公共子序列的长度。例如字符串`abcdgh`和字符串`aedfhr`的最长公共子序列是`adh`，它的长度是3.

<!--more-->

在线评测：

* 原始问题（单个字符，EOF结尾）：[UVaOJ 10405](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=16&page=show_problem&problem=1346)
* 原始问题（单个整数）：[UVaOJ 10066](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=12&page=show_problem&problem=1007)
* 原始问题（单个字符，井号结尾）：[UVaOJ 10192](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=13&page=show_problem&problem=1133)
* 输出具体方案（字符串）：[UVaOJ 531](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=7&page=show_problem&problem=472)
* 原始问题+小预处理（需特别注意审题！）：[UVaOJ 111](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=114&page=show_problem&problem=47)
* 要求序列必须连续：[HDU 1403](http://acm.hdu.edu.cn/showproblem.php?pid=1403)

## 问题分析
$LCS[A\_i, B\_j]$代表序列$A$的前$i$个字母和序列$B$的前$j$个字母的最长公共子序列长度。如果$A\_i = B\_j$，则最长公共子序列的值在之前的基础上增加1，即$LCS[A\_i, B\_j] = LCS[A\_{i-1}, B\_{j-1}] + 1$。若$A\_i \neq B\_j$，则最长公共子序列的长度不能增加，所以当前最长子序列的长度还是之前的长度。长度有可能是$LCS[A\_{i-1}, B\_j]$，也可能是$LCS[A\_i, B\_{j-1}]$，我们取两者中较大的一个即可。当然，如果$A\_i$或者$B\_j$有任意一个是空串，则LCS显然为0.

综上，最长公共子序列问题的状态转移方程为：

$$
LCS[A\_i, B\_i] =
\\left\\{
\\begin{array}{rcl}
0 &,& (i=0或j=0)\\\\
LCS[A\_{i-1}, B\_{j-1}] + 1 &,&(A\_i=B\_i)\\\\
\\max(LCS[A\_{i}, B\_{j-1}], LCS[A\_{i-1}, B\_{j}]) &,& (A\_i \neq B\_i)
\\end{array}
\\right.
$$

如果要求最长公共子序列必须连续（即最长公共子串），则状态转义方程为：

$$
LCCS[A\_i, B\_i] =
\\left\\{
\\begin{array}{rcl}
0 &,& (i=0或j=0或A\_i \\neq B\_i)\\\\
LCCS[A\_{i-1}, B\_{j-1}] + 1 &,&(A\_i=B\_i)
\\end{array}
\\right.
$$

**特别注意：此处$LCCS[A\_i, B\_i]$表示的是以$A\_i$和$B\_i$作为结尾（最后一个字符）的最长连续公共子串的长度。即$A\_i$和$B\_i$这两个字符必须包含在最长公共子串之中。这与非连续版本的要求（$A\_i$和$B\_i$只表示两个串的最后一个字符，这量个字符不一定在最长公共子序列之中）是有所不同的。该问题最后的答案也不是`dp`数组的右下角，而是整个`dp`数组中的最大值。**

如果需要输出具体的最长公共子序列，可以借助另外一个数组记录公共子序列不断延长的过程，并通过递归的方法在该数组中找到最长子序列延长的位置，并输出这个序列。

![][print-lcs]

如图，在每次为`dp`数组复制时，同时为记录方向的数组`bd`赋值，$A\_i = B\_j$时，赋值为“↖”。$A\_i \neq B\_j$时，`DP[i - 1][j]`较大时赋值为“↑”，`DP[i][j - 1]`较大时赋值为“←”。这个箭头其实是记录了最长公共子序列在两个输入字符串上延长的方式。我们可以选择右下角为起点，递归直到到达左边缘或上边缘，然后在回溯时输出所有标有“↖”处对应的字符即可。

如果需要输出所有的最长公共子序列，则应在构建`bd`数组时记录$LCS[A\_{i-1}, B\_i] = LCS[A\_i, B\_{i-1}]$的情形，这种情况下说明最长公共子序列有多个，需要对每一个子序列执行类似于深度优先搜索的操作，从而分别构建。具体实现请见文章最后的教学代码。

构建`bd`数组只是为了方便编程实现，也方便理解。实际上`dp`数组已经包含了全部信息，所有在实际编程中`bd`数组也可以省略。具体代码见编程实现一节。

## 复杂度分析

对于长度为$M$的串$A$和长度为$N$的串$B$而言，计算最长公共子序列长度的时间复杂度和空间复杂度均为$O(M \times N)$. 如果不需要输出具体方案，则可以只保留`dp`数组最近的2行，使用 *滚动数组* 进行优化，将空间复杂度降为$O(\min(M,N))$. 根据`dp`数组构建最优解的时间复杂度为$O(M+N)$. 

## 编程实现

上式中的`i`、`j`等变量表示字符时的取值范围是1～N，而等于0时表示取0个字符，而不是第0个字符，取零个字符即空串。而在C语言中，并没有“取
0个字符”这一操作。但是算法却要求在LCS二维数组中记录空串时LCS为零的情形。解决这种情形的方法有3种：

1. 在A、B两个字符串的第0位置添加任意字符，DP数组加一圈，循环[1, Len]，然后通过if判断手动在A[0]和B[0]时填0. 此方法可读性最高且最接近数学上的定义，但要在函数之外预处理字符串，适合学习使用。
2. DP数组加一圈，而A、B串保持原状，循环[1, Len]，但在每次访问字符串时要给字符串下标减一，以满足C字符串从0开始的要求。注意此方法中字符串的长度比DP数组每一维的长度不相等，而是少1. 此方法代码最简洁，函数代码可以整体记忆及套用，适合竞赛使用。
3. DP数组不动，串A、B也保持原状，循环[0, Len)，但要在每次访问DP数组时判断下标是否为-1，若为-1则用问号表达式返回0. 此方法代码最复杂但可节约少量空间，不推荐使用。

为了输出具体的最长公共子序列，我们还可以在生成`dp`数组的同时记录一个`bd`数组，用数字1、2、3依次代表“←”、“↑”、“↖”。核心代码如下：

```cpp
if(a[i - 1] == b[j - 1])
{
    dp[i][j] = dp[i - 1][j - 1] + 1;
    bd[i][j] = 3;
    continue;
}
if(dp[i - 1][j] > dp[i][j - 1])
{
    dp[i][j] = dp[i - 1][j];
    bd[i][j] = 2;
}
else
{
    dp[i][j] = dp[i][j - 1];
    bd[i][j] = 1;
}
```

在有了`bd`数组之后，就可以方便地递归输出一个具体的最长公共子序列，输出的代码如下：

```
void construct(int la, int lb)
{
    if(la == 0 || lb == 0) return;
    if(bd[la][lb] == 3)
    {
        construct(la - 1, lb - 1);
        printf("%s", a[la - 1]);
    }
    else if(bd[la][lb] == 2)
    {
        construct(la - 1, lb);
    }
    else
    {
        construct(la, lb - 1);
    }
}
```

当然`bd`数组并不是必需的，`dp`数组其实已经包含了所需的所有信息。使用`dp`数组构建最长公共子序列的代码稍微繁杂一些，基本就是将求解过程的条件判断重新写一遍。代码如下：

```cpp
void construct(int la, int lb)
{
    if(la == 0 || lb == 0) return;
    if(a[la - 1] == b[lb - 1])
    {
        construct(la - 1, lb - 1);
        printf("%s", a[la - 1]);
    }
    else if(dp[la][lb] == dp[la - 1][lb])
    {
        construct(la - 1, lb);
    }
    else
    {
        construct(la, lb - 1);
    }
}
```

或者也可以写成：

```cpp
void construct(int la, int lb)
{
    if(la == 0 || lb == 0) return;
    if(a[la - 1] == b[lb - 1])
    {
        construct(la - 1, lb - 1);
        printf("%s", a[la - 1]);
    }
    else
    {
        if(dp[la][lb] == dp[la - 1][lb])
        {
            construct(la - 1, lb);
        }
        else
        {
            construct(la, lb - 1);
        }
    }
}
```

这样写代码更复杂一点，但形式与计算`dp`数组时更为接近。

## 题目代码


UVaOJ 10405 方法1：

字符串前追加一个无用字符，`dp`数组加一圈。`lcs()`函数代码与数学表达式完全一致，注意`main()`函数中读入数据和求长度的方法。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char a[1010];
char b[1010];
int dp[1010][1010];

int lcs(char *a, int la, char *b, int lb)
{
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(a[i] == b[j]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i][j - 1] > dp[i - 1][j] ?
                dp[i][j - 1] : dp[i - 1][j];
        }
    }
    return dp[la][lb];
}
int main()
{
    while(1)
    {
        if(gets(a + 1) == NULL) break;
        gets(b + 1);
        a[0] = ' ';
        b[0] = ' ';
        printf("%d\n", lcs(a, strlen(a) - 1, b, strlen(b) - 1));
    }
}
```

UVaOJ 10405 方法2：

字符串保持原状，`dp`数组加一圈，此为最常用且简洁的方式，算法导论上也以此方式描述。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char a[1010];
char b[1010];
int dp[1010][1010];

int lcs(char *a, int la, char *b, int lb)
{
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i][j - 1] > dp[i - 1][j] ? 
                            dp[i][j - 1] : dp[i - 1][j];
        }
    }
    return dp[la][lb];
}
int main()
{
    while(1)
    {
        if(gets(a) == NULL) break;
        gets(b);
        printf("%d\n", lcs(a, strlen(a), b, strlen(b)));
    }
}
```

UVaOJ 10405 方法3：

字符串和`dp`数组均保持原状，需要使用较为复杂的逻辑处理可能存在的下标越界问题。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char a[1010];
char b[1010];
int dp[1010][1010];

int lcs(char *a, int la, char *b, int lb)
{
    memset(dp, 0, sizeof(dp));
    for(int i = 0; i < la; i++)
    {
        for(int j = 0; j < lb; j++)
        {
            if(a[i] == b[j])
            {
                if(i == 0 || j == 0) dp[i][j] = 1;
                else dp[i][j] = dp[i - 1][j - 1] + 1;
            }
            else dp[i][j] = (j == 0 ? 0 : dp[i][j - 1]) > (i == 0 ? 0 : dp[i - 1][j]) ? 
                            (j == 0 ? 0 : dp[i][j - 1]) : (i == 0 ? 0 : dp[i - 1][j]);
        }
    }
    return dp[la - 1][lb - 1];
}
int main()
{
    while(1)
    {
        if(gets(a) == NULL) break;
        gets(b);
        printf("%d\n", lcs(a, strlen(a), b, strlen(b)));
    }
}
```

UVaOJ 10066:

字符输入变整数输入，改`lcs()`函数的数据类型即可。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int a[110], b[110];
int dp[110][110];

int lcs(int *a, int la, int *b, int lb)
{
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ?
                            dp[i - 1][j] : dp[i][j - 1];
        }
    }
    return dp[la][lb];
}

int main()
{
    int n1, n2;
    for(int cs = 1; ; cs++)
    {
        scanf("%d %d", &n1, &n2);
        if(n1 == 0 || n2 == 0) break;
        for(int i = 0; i < n1; i++) scanf("%d", &a[i]);
        for(int i = 0; i < n2; i++) scanf("%d", &b[i]);
        printf("Twin Towers #%d\n", cs);
        printf("Number of Tiles : %d\n\n", lcs(a, n1, b, n2));
    }
}
```

UVaOJ 10192:

规定井号为输入的结束，主函数中简单处理即可。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char a[110], b[110];
int dp[110][110];

int lcs(char *a, int la, char *b, int lb)
{
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ?
                            dp[i - 1][j] : dp[i][j - 1];
        }
    }
    return dp[la][lb];
}

int main()
{
    for(int cs = 1; ; cs++)
    {
        gets(a);
        if(a[0] != '#') gets(b);
        else break;
        printf("Case #%d: you can visit at most %d cities.\n", cs, lcs(a, strlen(a), b, strlen(b)));
    }
    return 0;
}
```

UVaOJ 531:

要求输出具体的最长公共子序列，且序列的每个元素为一个字符串（单词）。下列代码已经通过注释的方式给出了使用`bd`数组和不用`bd`数组的两种实现方法。

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char wds_a[110][35];
char wds_b[110][35];
int dp[110][110];
//int bd[110][110];

int lcs(char a[][35], int la, char b[][35], int lb)
{
    memset(dp, 0, sizeof(dp));
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(strcmp(a[i - 1], b[j - 1]) == 0)
            {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                bd[i][j] = 3;
                continue;
            }
            if(dp[i - 1][j] > dp[i][j - 1])
            {
                dp[i][j] = dp[i - 1][j];
                bd[i][j] = 2;
            }
            else
            {
                dp[i][j] = dp[i][j - 1];
                bd[i][j] = 1;
            }
        }
    }
    return dp[la][lb];
}

void construct(int depth, int la, int lb)
{
    if(la == 0 || lb == 0) return;
    if(strcmp(wds_a[la - 1], wds_b[lb - 1]) == 0) //Construct without [bd] array
    //if(bd[la][lb] == 3) //Construct with [bd] array
    {
        construct(depth + 1, la - 1, lb - 1);
        //printf("[%d]", la);
        printf("%s", wds_a[la - 1]);
        if(depth == 0) printf("\n");
        else printf(" ");
    }
    else if(dp[la][lb] == dp[la - 1][lb])  //Construct without [bd] array
    //else if(bd[la][lb] == 2) //Construct with [bd] array
    {
        construct(depth, la - 1, lb);
    }
    else
    {
        construct(depth, la, lb - 1);
    }
}

int main()
{
    char str[35];
    while(1)
    {
        int la = 0, lb = 0;
        for(int i = 0; ; i++)
        {
            if(scanf("%s", str) == EOF) return 0;
            if(str[0] == '#') break;
            strcpy(wds_a[i], str);
            la++;
        }
        for(int i = 0; ; i++)
        {
            scanf("%s", str);
            if(str[0] == '#') break;
            strcpy(wds_b[i], str);
            lb++;
        }
        int len = lcs(wds_a, la, wds_b, lb);
        construct(0, la, lb);
    }
    return 0;
}
```

## 教学代码

输入两个字符串，输出两个字符串的最长公共子序列的长度，并列出所有的最长公共子序列，最后以图形化的形式输出用于构建最优解的`bd`数组。代码如下：

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>

int dp[100][100];
char a[100], b[100];
int bd[100][100];

int lcs(char *a, int la, char *b, int lb)
{
    memset(dp, 0, sizeof(dp));
    memset(bd, 0, sizeof(bd));
    for(int i = 1; i <= la; i++)
    {
        for(int j = 1; j <= lb; j++)
        {
            if(a[i - 1] == b[j - 1])
            {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                bd[i][j] = 3;
            }
            else
            {
                if(dp[i - 1][j] > dp[i][j - 1])
                {
                    dp[i][j] = dp[i - 1][j];
                    bd[i][j] = 2;
                }
                else if(dp[i - 1][j] < dp[i][j - 1])
                {
                    dp[i][j] = dp[i][j - 1];
                    bd[i][j] = 1;
                }
                else if(dp[i - 1][j] == dp[i][j - 1])
                {
                    dp[i][j] = dp[i][j - 1];
                    bd[i][j] = 4;
                }
            }
        }
    }
    return dp[la][lb];
}

void printlcs(int la, int lb, int depth, std::string s)
{
    if(la == 0 || lb == 0) return;
    if(bd[la][lb] == 3)
    {
        s = a[la - 1] + s;
        printlcs(la - 1, lb - 1, depth - 1, s);
        if(depth == 1) printf("*%s\n", s.c_str());
    }
    else
    {
        if(bd[la][lb] == 2)
        {
            printlcs(la - 1, lb, depth, s);
        }
        else if(bd[la][lb] == 1)
        {
            printlcs(la, lb - 1, depth, s);
        }
        else if(bd[la][lb] == 4)
        {
            printlcs(la - 1, lb, depth, s);
            printlcs(la, lb - 1, depth, s);
        }
    }
}

void printbd(int la, int lb)
{
    for(int i = -1; i <= la; i++)
    {
        for(int j = -1; j <= lb; j++)
        {
            
            if(i == -1)
            {
                if(j == -1) printf(" ＼");
                else if(j == 0) printf("|b:");
                else printf("{%c}", b[j - 1]);
                continue;
            }
            if(j == -1)
            {
                if(i == 0) printf("a: ");
                else printf("{%c}", a[i - 1]);
                continue;
            }
            
            if(bd[i][j] == 0) printf("[0]");
            else if(bd[i][j] == 1) printf("[<]");
            else if(bd[i][j] == 2) printf("[^]");
            else if(bd[i][j] == 3) printf("[\\]");
            else if(bd[i][j] == 4) printf("[Y]");
            else printf("[%d]", bd[i][j]);
        }
        printf("\n");
    }
}

int main()
{
    gets(a);
    gets(b);
    int la = strlen(a);
    int lb = strlen(b);
    int len = lcs(a, la, b, lb);
    printf("------------------------\n");
    printf("LCS-Length = %d\n", len);
    printf("List of LCS(s):\n");
    printlcs(la, lb, len, "");
    printf("--------bd table--------\n");
    printbd(la, lb);
    return 0;
}
```

测试输入：


```
ABCBDAB
BDCABA
```

程序输出：

```
------------------------
LCS-Length = 4
List of LCS(s):
*BCBA
*BCAB
*BDAB
--------bd table--------
 ＼|b:{B}{D}{C}{A}{B}{A}
a: [0][0][0][0][0][0][0]
{A}[0][Y][Y][Y][\][<][\]
{B}[0][\][<][<][Y][\][<]
{C}[0][^][Y][\][<][Y][Y]
{B}[0][\][Y][^][Y][\][<]
{D}[0][^][\][Y][Y][^][Y]
{A}[0][^][^][Y][\][Y][\]
{B}[0][\][^][Y][^][\][Y]
```

其中`<`表示左箭头，`^`表示上箭头，`\`表示左上箭头，`Y`表示分支（向上或向左都可以，需要分别搜索两条路径）。搜索的起点应设为右下角。

[print-lcs]: /images/print-lcs.png