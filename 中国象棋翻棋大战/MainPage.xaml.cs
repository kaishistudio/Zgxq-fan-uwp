using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.ApplicationModel.Core;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.System;
using Windows.UI;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

// https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x804 上介绍了“空白页”项模板

namespace 中国象棋翻棋大战
{
    /// <summary>
    /// 可用于自身或导航至 Frame 内部的空白页。
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            wv.DefaultBackgroundColor = Colors.Transparent;
            wv.Navigate(new Uri("ms-appx-web:///xiangqi/index.html"));
            wv.Width = 520;
            wv.Height = 580;
            g_root.Background = new ImageBrush() { ImageSource = new BitmapImage(new Uri("ms-appx:/xiangqi/img/stype_2/bg.jpg")) };
            wv.ScriptNotify += (s1, e1) =>
            {
                showmsg(e1.Value, "提示");
            };
            wv.NavigationCompleted += (s1, e1) =>
            {
                if (_firstrun)
                {
                    wv_insertcode("playlever", "3");
                    _firstrun = false;
                }
            };
            Rotation.Begin();
        }
        bool _firstrun = true;
        async void wv_insertcode(string scriptname, string insertcode)
        {
            try
            {
                await wv.InvokeScriptAsync(scriptname, new[]
                {
                insertcode,
            });
            }
            catch { }
        }
        async void showmsg(string t, string tt)
        {
            await new MessageDialog(t, tt).ShowAsync();
        }
        async private void abb_play_Click(object sender, RoutedEventArgs e)
        {
            int lever = 3;
            ListBox lb = new ListBox();
            lb.Items.Add("新手水平");
            lb.Items.Add("中级水平");
            lb.Items.Add("大师水平");
            lb.SelectedIndex = 0;
            ContentDialog cd = new ContentDialog()
            {
                Title = "选择难度"
            };
            cd.Content = lb;
            cd.PrimaryButtonText = "开局";
            cd.PrimaryButtonClick += (s1, e1) => {

                lever = lb.SelectedIndex + 3;
                wv_insertcode("playlever", lever + "");
            };
            await cd.ShowAsync();
        }

        private void abb_redo_Click(object sender, RoutedEventArgs e)
        {
            wv_insertcode("redo", "");
        }

        private void abb_about_Click(object sender, RoutedEventArgs e)
        {
            string tt = "关于";
            string t = "名称：中国象棋 翻棋大战\n版本：1.0.0\n象棋AI引擎：1.0版\n作者：KS STUDIO";
            showmsg(t, tt);
        }
        async private void abb_999_Click(object sender, RoutedEventArgs e)
        {
            await Launcher.LaunchUriAsync(new Uri(@"ms-windows-store://pdp/?productid=9pfm482bffg2"));
        }
        int i = 2;
        private async void TextBlock_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            ContentDialog cd = new ContentDialog()
            {
                Title = "更换皮肤将重新开局，确定吗？",
                CloseButtonText = "取消",
                PrimaryButtonText = "确定",
            };
            cd.PrimaryButtonClick += (ss, ee) => {
                wv_insertcode("skin", "");
                i = i == 1 ? 2 : 1;
                g_root.Background = new ImageBrush() { ImageSource = new BitmapImage(new Uri($"ms-appx:/xiangqi/img/stype_{i}/bg.jpg")) };

            };
            await cd.ShowAsync();
        }

        private void TextBlock_PointerEntered(object sender, PointerRoutedEventArgs e)
        {
            (sender as TextBlock).Opacity = 0.8;
            Window.Current.CoreWindow.PointerCursor = new Windows.UI.Core.CoreCursor(Windows.UI.Core.CoreCursorType.Hand, 1);
        }

        private void TextBlock_PointerExited(object sender, PointerRoutedEventArgs e)
        {
            (sender as TextBlock).Opacity = 1;
            Window.Current.CoreWindow.PointerCursor = new Windows.UI.Core.CoreCursor(Windows.UI.Core.CoreCursorType.Arrow, 1);
        }

        private void abb_wanfa_Click(object sender, RoutedEventArgs e)
        {
            string tt = "玩法说明";
            string t = "这款小游戏是一款基于中国象棋规则的趣味游戏，游戏玩法：\n" +
                "1.游戏开始前除将(帅)和士，其他都是翻棋状态并且是随机的，翻棋的状态下各方只能翻己方棋盘的棋。\n" +
                "2.棋翻开后各方可以操控任意棋盘己方的棋。\n" +
                "2.之后其他规则与传统象棋相同，最后吃将(帅)后胜利！\n\n" +
                "祝您游戏愉快！";
            showmsg(t, tt);
        }
    }
}
