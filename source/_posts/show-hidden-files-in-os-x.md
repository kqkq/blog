---
title: Mac OS X系统下显示隐藏文件
date: 2011-09-09 19:13:58
tags:
categories: 果粉手札
---

显示隐藏文件：

```
defaults write com.apple.finder AppleShowAllFiles -bool true
KillAll Finder
```

恢复隐藏

```
defaults write com.apple.finder AppleShowAllFiles -bool false
KillAll Finder
```
