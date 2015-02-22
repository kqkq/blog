title: 在Mac OS X下刷新DNS缓存
date: 2014-03-12 01:50:56
tags:
categories: 果粉手札
---

与Windows不同的是，各版本的Mac OS X系统刷新DNS缓存的方法是不一样的。

1. 对于Tiger或更低版本 Mac OS：

		sudo lookupd -flushcache
	
2. 对于Leopard和Snow Leopard：

		sudo dscacheutil -flushcache
	
3. 对于Lion、Mountain Lion和Mavericks：

		sudo killall -HUP mDNSResponder