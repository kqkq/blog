---
title: "LeetCode 002 Add Two Numbers 题解"
date: 2015-04-09 23:31:03
categories: 编程之美
---

## 题意

用两个单向链表给出两个整数。求两个整数的和，以链表形式返回。输入的和返回的链表顺序都是从低位到高位。

<!-- more -->

## 分析

递归遍历链表，依次求和即可。注意进位。最初没有很好地理解题意，以为是一个反转单向链表的问题，后来仔细读题后明白两个输入链表和一个输出链表都是从低位到高位的顺序，这样这个题目就很简单了。提交的时候Compile Error了几次，是因为新建节点的方式不对。由于`ListNode`结构体已经给出了一个构造函数，因此`new`的时候必须是`new ListNode(0)`这样给出一个初始值。一开始没有明白那个`ListNode(int x)`是什么意思，准确地说是没发现后面给出了这个函数的定义（空函数体`{}`）。

另外，创建新节点时应该是有技巧的，要确定有下一位数才创建下一个节点，不要在计算最后一位数时创建多余的节点。在递归创建节点时，可以创建节点后再递归，也可以传入空节点然后在递归到下一层时创建节点。我采用的是后者，由于要改变上层递归过来的指针的指向（而不只是指针指向的内容），所以要使用一个双指针，也可以使用指针的引用。使用双指针时，要注意解除引用运算符`*`的优先级低于间接引用运算符`->`，因此在操作双指针的结构体时要在前面解除引用的时候加括号，例如`(*result)->val`。由于本人是C语言的脑残粉，所以就使用了这种指针满天飞的方式，请各位看官轻拍~

编写的时候已经仔细考虑了进位、两个数不等长、最后一个节点等情况，所以解决了那个编译错误之后就一次AC了。

C++代码：

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    void add(ListNode *d1, ListNode *d2, ListNode **result, int carry)
    {
        if(d1 == NULL && d2 == NULL && carry == 0) return;
        *result = new ListNode(0);
        (*result)->val = (d1 ? d1->val : 0) + (d2 ? d2->val : 0) + carry;
        if((*result)->val >= 10)
        {
            (*result)->val -= 10;
            add(d1 ? d1->next : NULL, d2 ? d2->next : NULL, &((*result)->next), 1);
        }
        else
        {
            add(d1 ? d1->next : NULL, d2 ? d2->next : NULL, &((*result)->next), 0);
        }
    }
    ListNode *addTwoNumbers(ListNode *l1, ListNode *l2) {
        ListNode *first;
        add(l1, l2, &first, 0);
        return first;
    }
};
```