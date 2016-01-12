---
title: Unix编程入门之递归遍历目录 
date: 2011-02-15 20:01:20
tags:
categories: 编程之美
---

假期读了久负盛名的APUE(Advanced Programming in the UNIX Environment)，确切的说是读了几页……发现这本书虽然名为高级编程，但是对基础知识的讲解还是挺详细的。大概老外的书就有这么个好处吧……

全书的第一个程序就是列出指定目录下的所有文件和目录。书上的程序只列出了当前目录，不会递归的遍历子目录。于是我就照葫芦画瓢，写了个递归，深度优先的列出子目录。

写这篇文章主要也是要纪念一下，纪念自己写的第一个UNIX环境下的程序。用vim编辑，敲编译参数编译，用gdb命令行调试，确实与在Windows下用图形化的IDE不同的体验。

<!--more-->

最后附上程序。我的环境是Mac OS X 10.6.6，Linux环境下应该也可以运行,吧~

```
#include <sys/types.h>
#include <dirent.h>
#include <cstdio>
#include <cstring>

void dfs(char *fileName, int indent = -1)
{
    DIR *dp;
    struct dirent   *dirp;
    char fn[500];

    indent++;

    if((dp = opendir(fileName)) == NULL) return;

    while((dirp = readdir(dp)) != NULL)
    {
        if(dirp -> d_name[0] == '.') continue;
        for(int i = 0; i < indent; i++) printf("  ");
        printf("%s\n", dirp -> d_name);
        sprintf(fn, "%s/%s", fileName, dirp->d_name);
        dfs(fn, indent);
    }
}

int main(int argc, char *argv[])
{
    DIR *dp;
    if(argc != 2)
    {
        printf("A single argument is required\n");
        return 0;
    }

    if((dp = opendir(argv[1])) == NULL)
    {
        printf("Can't open %s\n", argv[1]);
        return 0;
    }

    closedir(dp);
    dfs(argv[1]);
    return 0;
}
```
