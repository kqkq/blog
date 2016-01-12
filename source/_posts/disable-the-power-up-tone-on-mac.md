---
title: 安全禁用Macbook的开机音效
date: 2011-09-10 19:37:23
tags:
categories: 果粉手札
---

苹果系统开机时会发出“咣”的一声，这个音效本身没有什么美感可言，在安静的地方比如图书馆开机时更容易引起尴尬。然而苹果系统本身并未提供一个功能禁用这个音效。

我写了这样一个脚本，可以禁用Macbook的开机音效。其原理是，开机音效声音的大小取决于关机前系统声音的大小，如果关机前是静音的，则开机音效也被静音。因此在关机之前执行一个脚本，将系统设为静音，开机后再执行一个脚本，将静音状态取消，即可实现完美去除开机音效。

除此方法外，还有一些软件可以禁用开机音效，但这些软件通常是通过修改nvram的方式实现的，具有一定的危险性，而且兼容性也得不到保障，比如升级到Mac OS X Lion后这些软件就都失效了。而这段脚本则可以在所有系统上通用。

<!--more-->

`mute_on_startup.sh`脚本的内容如下

``` bash
#!/bin/bash
if [ "$USER" != 'root' ]; then
    echo 'You must run this script as root'
    echo -e "Try: \033[0;31;1msudo $0 $1\033[0m instead"
    exit 1
fi 
if [ "$1" == 'restore' ]; then
    echo 'Deleting script file...'
    rm /Library/Scripts/mute-on.sh
    rm /Library/Scripts/mute-off.sh
    echo 'Deleting login script...'
    defaults delete com.apple.loginwindow LoginHook
    defaults delete com.apple.loginwindow LogoutHook
    echo 'Done!'
    exit 1
fi
if [ "$1" != '' ]; then
    echo 'Unknown argument(s)'
    exit 1
fi
echo 'Creating script...'
bash -c 'cat > /Library/Scripts/mute-on.sh <<EOF
#!/bin/bash
osascript -e 'set volume with output muted'
EOF
'
bash -c 'cat > /Library/Scripts/mute-off.sh <<EOF
#!/bin/bash
osascript -e 'set volume without output muted'
EOF
'
echo 'Grantng execution privilege...'
chmod u+x /Library/Scripts/mute-on.sh
chmod u+x /Library/Scripts/mute-off.sh
echo 'Creating login script...'
sudo defaults write com.apple.loginwindow LogoutHook /path/to/mute-on.sh
sudo defaults write com.apple.loginwindow LoginHook /path/to/mute-off.sh
echo 'Done!'
echo -e "To retore the modify, try: \033[0;31;1msudo $0 restore\033[0m"
```

使用方法：

赋予执行权限并执行脚本

``` bash
chmod u+x mute_on_startup.sh
sudo ./mute_on_startup.sh
```

如果要恢复开机音效，请执行

``` bash
sudo mute_on_startup.sh restore
```
