---
title: "LeetCode 001 Two Sum 题解"
date: 2015-04-09 18:29:43
categories: 编程之美
math: true
---

## 题意

给一个不保证有序的数列`numbers`，在数列中找到2个数，使得两个数的和等于一个指定的数`target`，返回这两个数的索引`index1`和`index2`。

<!--more-->
## 分析

依次尝试所有组合，需要$O(n^2)$的时间复杂度，这显然会导致超时。我们可以对序列进行排序，依次选择每一个数，然后用`target`减去当前的数，然后通过二分查找法在有序表中查找是否存在与当前数配对的另外一个数。这样就可以将时间复杂度降为$O(n\log n)$。

由于排序后数的索引会发生变化，所以需要记录每个数排序之前的索引编号。可以将数和索引做成一个结构体，然后对结构体排序。

在C语言的标准库中，有2个函数可帮我们完成这个目标，一个是快速排序函数`qsort`（[文档](http://www.cplusplus.com/reference/cstdlib/qsort/)），另一个是二分查找函数`bsearch`（[文档](http://www.cplusplus.com/reference/cstdlib/bsearch/)）。这两个函数都需要包含头文件`stdlib.h`。

由于需要返回2个数，所以这道题的C语言函数要求返回一个指针，正确的做法是使用`malloc`在堆上分配内存，而返回局部变量的数组是行不通的。记住一句话：永远不要返回局部自动变量的指针。

C语言源代码：

```c
typedef struct
{
    int num;
    int index;
} Entry;

int cmp(const void *a, const void *b)
{
    return (*((Entry*)a)).num - (*((Entry*)b)).num;
}

int *twoSum(int numbers[], int n, int target) {
    Entry *arr = (Entry*)malloc(n * sizeof(Entry));
    int *result = (int*)malloc(2 * sizeof(int));
    for(int i = 0; i < n; i++)
    {
        arr[i].num = numbers[i];
        arr[i].index = i + 1;
    }
    qsort(arr, n, sizeof(Entry), cmp);
    for(int i = 0; i < n; i++)
    {
        Entry key;
        key.num = target - arr[i].num;
        Entry *p = (Entry*)bsearch(&key, arr, n, sizeof(Entry), cmp);
        if(p != NULL)
        {
            int index1 = arr[i].index, index2 = p->index;
            result[0] = index1 < index2 ? index1 : index2;
            result[1] = index1 > index2 ? index1 : index2;
            return result;
        }
    }
    free(arr);
    return result;
}
```