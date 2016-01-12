---
title: 快速建立CodeBlocks工程的小工具
date: 2010-01-29 23:36:55
tags:
categories: 编程之美
---

CodeBlocks是一个优秀的集成开发环境。不过我们初学者通常只用它写写简单的程序，这些程序往往只有一个源文件。直接打开Cpp源文件虽然可以编译，但无法加断点调试。如果要调试，则要建立一个工作空间和一个工程，步骤较为繁琐。今天写了个小程序，能快速为单一的源文件建立CodeBlocks工程，极大简化了小程序的调试工作。

<!--more-->

先上图：

![][demo]

完整代码如下：

``` cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using System.IO;
using IWshRuntimeLibrary;
 
namespace CBP_Creater
{
    static class Program
    {
        const string CBPath = "C:\\Program Files\\CodeBlocks\\codeblocks.exe";
 
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                if (MessageBox.Show("请确定本程序所在路径，安装后您将不能更改本程序所在位置。点确定开始安装！", "欢迎使用", MessageBoxButtons.OKCancel, MessageBoxIcon.Question, MessageBoxDefaultButton.Button2) == DialogResult.OK)
                {
                    Install();
                    MessageBox.Show("安装成功！在源程序上点击右键，在发送到菜单里就可以看到本程序了。", "完成", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    Environment.Exit(0);
                }
                else
                {
                    Environment.Exit(0);
                }
            }
            string[] cmd = args;
            string Total = cmd[0];
            int back = Total.LastIndexOf('\\');
            string FullName = Total.Substring(back + 1);
            string Filename = FullName.Substring(0, FullName.LastIndexOf('.'));
            string Path = Total.Substring(0, back);
            if (FullName.IndexOf(".c") == -1 && FullName.IndexOf(".cpp") == -1)
            {
                MessageBox.Show("源代码文件扩展名错误。只接受*.c或*.cpp","错误",MessageBoxButtons.OK,MessageBoxIcon.Warning);
                Environment.Exit(0);
            }
            //下面创建工程文件
            FileStream fCBP = new FileStream(Path + "\\" + Filename + ".cbp", FileMode.Create);
            StreamWriter swCBP = new StreamWriter(fCBP);
            string sCBP = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n<CodeBlocks_project_file>\n\t<FileVersion major=\"1\" minor=\"6\" />\n\t<Project>\n\t\t<Option title=\"" + Filename + "\" />\n\t\t<Option pch_mode=\"2\" />\n\t\t<Option compiler=\"gcc\" />\n\t\t<Build>\n\t\t\t<Target title=\"Debug\">\n\t\t\t\t<Option output=\"bin\\Debug\\" + Filename + "\" prefix_auto=\"1\" extension_auto=\"1\" />\n\t\t\t\t<Option object_output=\"obj\\Debug\\\" />\n\t\t\t\t<Option type=\"1\" />\n\t\t\t\t<Option compiler=\"gcc\" />\n\t\t\t\t<Compiler>\n\t\t\t\t\t<Add option=\"-g\" />\n\t\t\t\t</Compiler>\n\t\t\t</Target>\n\t\t\t<Target title=\"Release\">\n\t\t\t\t<Option output=\"bin\\Release\\" + Filename + "\" prefix_auto=\"1\" extension_auto=\"1\" />\n\t\t\t\t<Option object_output=\"obj\\Release\\\" />\n\t\t\t\t<Option type=\"1\" />\n\t\t\t\t<Option compiler=\"gcc\" />\n\t\t\t\t<Compiler>\n\t\t\t\t\t<Add option=\"-O2\" />\n\t\t\t\t</Compiler>\n\t\t\t\t<Linker>\n\t\t\t\t\t<Add option=\"-s\" />\n\t\t\t\t</Linker>\n\t\t\t</Target>\n\t\t</Build>\n\t\t<Compiler>\n\t\t\t<Add option=\"-Wall\" />\n\t\t</Compiler>\n\t\t<Unit filename=\"" + FullName + "\">\n\t\t<Extensions>\n\t\t\t<code_completion />\n\t\t\t<debugger />\n\t\t</Extensions>\n\t</Project>\n</CodeBlocks_project_file>\n";
            swCBP.WriteLine(sCBP);
            swCBP.Close();
            fCBP.Close();
            //下面创建WorkSpace
            FileStream fWorkSpace = new FileStream(Path + "\\" + Filename + ".workspace", FileMode.Create);
            StreamWriter swWorkSpace = new StreamWriter(fWorkSpace);
            string sWorkSpace = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n<CodeBlocks_workspace_file>\n\t<Workspace title=\"Workspace Created by KQ\">\n\t\t<Project filename=\"" + Filename + ".cbp\" active=\"1\" />\n\t</Workspace>\n</CodeBlocks_workspace_file>";
            swWorkSpace.WriteLine(sWorkSpace);
            swWorkSpace.Close();
            fWorkSpace.Close();
            //启动CodeBlocks
            try
            {
                //System.Diagnostics.Process.Start(CBPath, Path + "\\" + Filename + ".workspace");
                //1.1.0.0版更新。修复了cpp所在目录不能有空格的Bug
                System.Diagnostics.Process.Start(CBPath, "\"" + Path + "\\" + Filename + ".workspace" + "\"");
            }
            catch
            {
                MessageBox.Show("打开CodeBlocks失败，可能是CodeBlocks的安装路径不匹配", "错误", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            Application.Exit();
        }
 
        static void Install()
        {
            WshShell shell = new WshShell();
            IWshShortcut Shortcut = (IWshShortcut)shell.CreateShortcut(Environment.GetFolderPath(Environment.SpecialFolder.SendTo) + "\\" + "生成CodeBlocks工程 by KQ.lnk");
            Shortcut.TargetPath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            Shortcut.WorkingDirectory = System.Environment.CurrentDirectory;
            Shortcut.WindowStyle = 1;
            Shortcut.Description = "Powered by KQ's Technology Studio";
            Shortcut.IconLocation = Shortcut.TargetPath + ", 0";
            Shortcut.Save();
        }
    }
}
```

[demo]: /images/codeblocks-tool-1.jpg
