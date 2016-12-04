---
title: "LeetCode 226 Invert Binary Tree 题解"
date: 2015-07-09 15:33:04
categories: 编程之美
---

## 题意

翻转一棵二叉树，例如将

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

翻转为

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

<!--more-->

## 分析

思路非常简单，递归地翻转所有子树即可。在马桶上用iPad一次刷过了此题。直接上代码。

C代码：

```c
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     struct TreeNode *left;
 *     struct TreeNode *right;
 * };
 */
struct TreeNode* invertTree(struct TreeNode* root) {
    struct TreeNode *temp;
    if(root == NULL) return NULL;
    if(root->left) invertTree(root->left);
    if(root->right) invertTree(root->right);
    temp = root->left;
    root->left = root->right;
    root->right = temp;
    return root;
}
```
