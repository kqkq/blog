title: 整数运算计算组合数C(n, k)
date: 2012-01-27 18:00:15
tags:
categories: 编程之美
---

计算组合数$C_n^k$的公式为

$$
C_n^k = \frac{n!}{k! \times (n - k)!}
$$

由于用到了阶乘，极容易导致数据溢出，应用中应采用边乘边除的方法。除法一般需要用到浮点数，但通过数论中的定理，可以通过整数运算实现。

```
int C(int n, int k)
{
    long long s = 1;
    int x = 1;
    if(k > n - k) k = n - k;
    for(int i = n; i > n - k; i--)
    {
        s *= i;
        s /= x;
        x++;
    }
    return (int)s;
}
```

代码如下如果想测试你自己的实现，请移步[POJ 2249题](http://poj.org/problem?id=2249)
