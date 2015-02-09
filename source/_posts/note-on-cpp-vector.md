title: C++ STL学习笔记之容器
date: 2010-03-07 15:32:12
tags:
categories: 编程之美
toc: true
---

今天去OJ刷水题，与其说去刷题，不如说是去学C++标准库。现将学习成果记录下来。

## 使用map容器进行单词统计

题目地址：<http://acm.bnu.edu.cn/contest/problem_show.php?pid=4045>

大意：统计一篇文章中每个单词的出现次数。将大于3次的单词按字典序输出。

分析：传统方法要自己实现单词查找操作，还要对单词进行排序。调试复杂，代码长度通常会超过1000字节。

使用C++的`map`容器实现，无需用户实现查找操作，由于`map`容器在标准库中通常以树结构实现，所以其元素的顺序不是由用户管理的。换句话说，无论如何插入元素，在用户看来元素都是有序的。由于`map`树形结构的特点，不能使用下标顺序访问元素，而需要使用迭代器遍历。

<!--more-->

Code:

```
#include <iostream>
#include <string>
#include <map>
#include <ctype.h>

using namespace std;

void lcase(string *s)
{
     int l = s->length();
     for(int i = 0; i < l; i++)
     {
         if(isupper((*s)[i])) (*s)[i] += 32;
     }
}

int main()
{
    map<string, int> m;
    string str;
    
    while(cin >> str)
    {
        lcase(&str);
        m[str]++;
    }

    map<string,int>::iterator i;    
    map<string,int>::iterator ii;
    
    ii=m.end();
    int count=0;
    for(i = m.begin(); i != ii; i++)
    {
        if(i->second >= 3 && count < 10)
        {
             cout << i->first <<endl;
             count++;
        }
    }
}
```
 

## 使用vector容器简化排序操作

题目地址：<http://acm.bnu.edu.cn/contest/problem_show.php?pid=4166>

大意：对对象（结构体）进行排序，对前三项求和输出

分析：在做这道题的时候听到某大牛的抱怨——`my_qsort`调了半个小时了……囧

通常做法是建两个（甚至更多）数组，存几个元素，然后自己写排序。稍好一点的办法是调用C标准库的`qsort`。用C的`qsort`函数在这道题是可以的，可是`qsort`是一个不稳定的排序，对于一些要求稳定排序的题目不适用。比如BNUOJ的《YC大牛的判题任务》

C++标准库中的`vector`是一个连续的存储结构，具有很高的随机访问效率（跟数组一样），可以使用下标访问元素。调用C++标准库的`sort`函数进行排序，如果要求稳定排序，只需将`sort`改成`stable_sort`。

Code:

```
#include <cstdio>
#include <vector>
#include <algorithm>
using namespace std;

struct toy
{
    int num;
    double value;
    int price;
};

int cmp(toy a, toy b)
{
    return a.value > b.value;
}

int main()
{
    int n;
    toy t;
    int joy, price;
    vector<toy> vec;

    scanf("%d",&n);
    
    for(int i = 1; i <= n; i++)
    {
        scanf("%d%d", &joy, &price);
        t.num = i;
        t.value = (double)joy / price;
        t.price = price;
        vec.push_back(t);
    }

    sort(vec.begin(), vec.end(), cmp);
    printf("%d\n", vec[0].price + vec[1].price + vec[2].price);
    printf("%d\n%d\n%d\n", vec[0].num, vec[1].num, vec[2].num);
}
```

## 使用stack容器优化种子填充算法（非递归）

题目地址：<http://acm.bnu.edu.cn/contest/problem_show.php?pid=4165>

大意：对8-连通的区域进行填充，统计每个区域的大小

分析：写这道题的经历比较曲折。先是狂喜，以为很水，题目都没读完就下手写。直接写了一个递归的4向的种子填充。发现样例不过。再读题才发现是要填充8-连通区域的，汗啊……

好不容易改成了8向的，样例过了，再次狂喜。交上去竟然是Runtime Error....

再读题，发现数据范围是750\*750.数组已经开够了，唯一的可能就是爆栈了。去USACO找来这道题的数据，测到第七组数据时就爆栈了，这个数据是100\*150的，对于极限情况的数据就可想而知了。

看来这道题不能用递归方法来做了。不递归的话，要用自己实现的栈结构（或者队列）代替系统栈。这种方法要申请大量的内存以防止栈溢出，空间利用率较低。

使用C++ STL中的`stack`容器，可以方便的使用栈结构，而且其空间的申请和释放是由标准库实现的，无需用户干预。

Code：

```
#include <cstdio>
#include <stack>

using namespace std;

struct point
{
     int x;
     int y;
     point(int xx, int yy)
     {
         x = xx;
         y = yy;
     }
};

int floodfill(int x, int y, int w, int h, char** m, char fill, char unfill)
{
     stack<point> stk;
     point p(x, y);
     stk.push(p);
     int sum = 0;

     while(!stk.empty())
     {
         x = stk.top().x;
         y = stk.top().y;
         stk.pop();
         
         if(m[y][x] != fill)
         {
              m[y][x] = fill;
              sum++;
         }
         else continue;

         if(y != 0 && m[y - 1][x] == unfill) {stk.push(point(x, y - 1));}//上
         if(y != h && m[y + 1][x] == unfill) {stk.push(point(x, y + 1));}//下
         if(x != 0 && m[y][x - 1] == unfill) {stk.push(point(x - 1, y));}//左
         if(x != w && m[y][x + 1] == unfill) {stk.push(point(x + 1, y));}//右
         if(x != 0 && y != 0 && m[y - 1][x - 1] == unfill) {stk.push(point(x - 1, y - 1));}//左上
         if(x != 0 && y!=h && m[y + 1][x - 1]==unfill) {stk.push(point(x - 1, y + 1));}//左下
         if(x != w && y!=0 && m[y - 1][x + 1] == unfill) {stk.push(point(x + 1, y - 1));}//右上
         if(x != w && y!=h && m[y + 1][x + 1] == unfill) {stk.push(point(x + 1, y + 1));}//右下
     }

     return sum;
}

int main()
{
     char **map;
     int w, h; scanf("%d%d", &w, &h); getchar();
     map=new char*[h];

     for(int i = 0; i < h; i++)
     {
         map[i]=new char[w + 1];
         gets(map[i]);
     }

     int fill = '1';
     int max = 0;
     for(int i = 0; i < h; i++)
     {
         for(int j = 0; j < w; j++)
         {
              if(map[i][j] == '.')
              {
                   int n = floodfill(j, i, w - 1, h - 1, map, fill++, '.');
                   if(max < n) max = n;
              }
         }
     }

     printf("%d\n", max);
}
```

## 用vector实现的线性表插入、查找和删除操作

题目地址：<http://acm.bnu.edu.cn/contest/problem_show.php?pid=4101>

题目描述很简单，数据也很弱。主要是来说说`vector`容器的这几个操作。

`vector`是用线性表实现的，而且储存是连续的，可以使用下标直接访问。`vector`本身提供了插入（`insert`）操作和删除（`erase`）操作。但并没有提供查找（`find`）操作。我们可以只用`algorithm`库中的`find`泛型函数来实现查找。

题目比较简单，就不多说了，直接上代码~

```
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main()
{
    vector<int> v;
    int n, num;
    cin >> n;
    
    for(int i = 0; i < n; i++)
    {
        cin >> num;
        v.push_back(num);
    }

    int pos, val, del;
    cin >> pos >> val >> del;

    v.insert(v.begin() + pos - 1, val);
    v.erase(find(v.begin(), v.end(), del));
    cout<<v[0];
    for(int i=1;i<n;i++) cout<<" "<<v[i];
    cout<<endl;
}
```