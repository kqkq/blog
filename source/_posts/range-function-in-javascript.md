---
title: 在JavaScript中实现类似于Python的range()函数
date: 2014-05-12 23:41:53
tags:
categories: 编程之美
---

Python中的`range()`函数（[文档](https://docs.python.org/2/library/functions.html#range)）可以生成由一个范围内的整数有序排列所构成的数组，这在很多情况下是十分方便的。而JavaScript中并没有这样一个函数，除了每次手写`for`循环之外，我们还可以手动实现自己的`range()`，提高可读性的同时实现了代码的复用。在StackOverflow上的[一篇帖子](http://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range)中，对这个问题给出了很好的回答。整理如下：

<!--more-->

```js
function range(start, stop, step)
{
    if (typeof(stop) == 'undefined')
    {
        // one param defined
        stop = start;
        start = 0;
    }
    if (typeof(step) == 'undefined')
    {
        step = 1;
    }
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop))
    {
        return [];
    }
    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step)
    {
        result.push(i);
    }
    return result;
}
```

下面测试这个函数，在JavaScript控制台中输入如下代码

```js
range(1, 10).forEach(function(i) {
    console.log(i);
});
```

应该会输出1，2，3，4，5，6，7，8，9这九个数字。

这个函数的行为几乎跟Python中的`range()`完全一样，是我见到的最完善的实现，大家可以将这段代码收藏起来备用。
