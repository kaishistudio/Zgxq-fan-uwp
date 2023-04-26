var play = play || {};
play.init = function () {
    play.my = 1;									//玩家方
    play.map = com.arr2Clone(com.initMap);		//初始化棋盘
    play.nowManKey = false;								//现在要操作的棋子
    play.pace = [];									//记录每一步
    play.isPlay = true;								//是否能走棋
    play.mans = com.mans;							//棋子集合
    play.bylaw = com.bylaw;							//棋子能走的着点
    play.show = com.show;							//显示棋局
    play.showPane = com.showPane;						//显示方块
    play.isOffensive = true;								//是否先手
    play.depth = play.depth || 3;					//搜索深度
    play.isFoul = false;								//是否犯规长将
    com.pane.isShow = false;								//隐藏方块
    for (var i = 0; i < play.map.length; i++) {						//初始化棋子->根据play.map设置com.mans
        for (var n = 0; n < play.map[i].length; n++) {
            var key = play.map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }
    play.show();												//显示棋局
    //绑定点击事件
    com.canvas.addEventListener("click", play.clickCanvas)		//画布添加点击事件
    //clearInterval(play.timer);
    //com.get("autoPlay").addEventListener("click", function(e) {
    //clearInterval(play.timer);
    //play.timer = setInterval("play.AIPlay()",1000);
    //	play.AIPlay()
    //})
    /*
    com.get("offensivePlay").addEventListener("click", function(e) {
        play.isOffensive=true;
        play.isPlay=true ;
        com.get("chessRight").style.display = "none";
        play.init();
    })
    com.get("defensivePlay").addEventListener("click", function(e) {
        play.isOffensive=false;
        play.isPlay=true ;
        com.get("chessRight").style.display = "none";
        play.init();
    })
    */
    com.get("regretBn").addEventListener("click", function (e) {			//悔棋
        play.regret();
    })
    /*
    var initTime = new Date().getTime();
    for (var i=0; i<=100000; i++){
        var h=""
        var h=play.map.join();
        //for (var n in play.mans){
        //	if (play.mans[n].show) h+=play.mans[n].key+play.mans[n].x+play.mans[n].y
        //}
    }
    var nowTime= new Date().getTime();
    z([h,nowTime-initTime])
    */
}
play.regret = function () {										//悔棋
    var map = com.arr2Clone(com.initMap);						//克隆地图
    for (var i = 0; i < map.length; i++) {							//初始化所有棋子->根据map设置com.mans
        for (var n = 0; n < map[i].length; n++) {
            var key = map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }
    var pace = play.pace;//每一步
    pace.pop();//JavaScript的 pop() 函数用于移除并返回数组中的最后一个元素。该方法会改变原数组。
    pace.pop();
    for (var i = 0; i < pace.length; i++) {//遍历每一步
        var p = pace[i].split("")//步是用一组数字记录
        var x = parseInt(p[0], 10);//旧棋子坐标x
        var y = parseInt(p[1], 10);//旧棋子坐标y
        var newX = parseInt(p[2], 10);//新棋子坐标x
        var newY = parseInt(p[3], 10);//新棋子坐标y
        var key = map[y][x];//获取地图上坐标棋子
        //try{
        var cMan = map[newY][newX];//新棋子
        if (cMan) com.mans[map[newY][newX]].isShow = false;//如果新棋子存在则不显示
        com.mans[key].x = newX;
        com.mans[key].y = newY;
        map[newY][newX] = key;//更新棋子操作
        delete map[y][x];
        if (i == pace.length - 1) {//如果遍历到底，则显示面板
            com.showPane(newX, newY, x, y)
        }
        //} catch (e){
        //	com.show()
        //	z([key,p,pace,map])
        //	}
    }
    play.map = map;//更新play地图
    play.my = 1;//轮到玩家方下子
    play.isPlay = true;//是否能走棋
    com.show();//显示棋局
}
//点击棋盘事件
play.clickCanvas = function (e) {
    if (!play.isPlay) return false;//如果不是玩家方下子则返回
    var key = play.getClickMan(e);//获取点击的棋子
    var point = play.getClickPoint(e);//点击棋子坐标
    var x = point.x;
    var y = point.y;
    if (key) {
        play.clickMan(key, x, y);	//如果棋子存在->点击棋子事件
    } else {
        play.clickPoint(x, y);	//如果棋子不存在->点击坐标事件
    }
    play.isFoul = play.checkFoul();//检测是不是长将
}
//点击棋子，两种情况，选中或者吃子
play.clickMan = function (key, x, y) {//点击棋子事件
    var man = com.mans[key];//得到key的棋子
    {
    //吃子
    //	现在要操作棋子	现在要操作的棋子≠点击		key棋子玩家方≠要操作棋子玩家方
    if (play.nowManKey && play.nowManKey != key && man.my != com.mans[play.nowManKey].my) {
        //if(man.IsFan)
        {
        //man为被吃掉的棋子
        if (play.indexOfPs(com.mans[play.nowManKey].ps, [x, y])) {//是否存在着点
            man.isShow = false;
            var pace = com.mans[play.nowManKey].x + "" + com.mans[play.nowManKey].y//pace：步
            //z(bill.createMove(play.map,man.x,man.y,x,y))
            delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];//删除地图中棋子
            play.map[y][x] = play.nowManKey;//更新地图
            com.showPane(com.mans[play.nowManKey].x, com.mans[play.nowManKey].y, x, y)//显示移动的棋子外框
            com.mans[play.nowManKey].x = x;
            com.mans[play.nowManKey].y = y;
            com.mans[play.nowManKey].alpha = 1
            play.pace.push(pace + x + y);
            play.nowManKey = false;
            com.pane.isShow = false;
            com.dot.dots = [];
            com.show()
            com.get("clickAudio").play();
            setTimeout("play.AIPlay()", 500);
            if (key == "j0") play.showWin(-1);
            if (key == "J0") play.showWin(1);
        }
    }
        // 选中棋子
    } else {
         if(man.IsFan){
             if(man.y>=5){
             man.IsFan=false;
            com.show();
            com.get("clickAudio").play();
            setTimeout("play.AIPlay()", 500);
            if (key == "j0") play.showWin(-1);
            if (key == "J0") play.showWin(1);
             }
         }
         else{
        if (man.my === 1) {
            if (com.mans[play.nowManKey]) com.mans[play.nowManKey].alpha = 1;
            man.alpha = 0.6;
            com.pane.isShow = false;
            play.nowManKey = key;
            com.mans[key].ps = com.mans[key].bl(); //获得所有能着点
            com.dot.dots = com.mans[key].ps
            com.show();
            //com.get("selectAudio").start(0);
            com.get("selectAudio").play();
        }
         }
    }
    }
}
//点击着点
play.clickPoint = function (x, y) {
    var key = play.nowManKey;
    var man = com.mans[key];
    if (play.nowManKey) {
        if (play.indexOfPs(com.mans[key].ps, [x, y])) {
            var pace = man.x + "" + man.y
            //z(bill.createMove(play.map,man.x,man.y,x,y))
            delete play.map[man.y][man.x];
            play.map[y][x] = key;
            com.showPane(man.x, man.y, x, y)
            man.x = x;
            man.y = y;
            man.alpha = 1;
            play.pace.push(pace + x + y);
            play.nowManKey = false;
            com.dot.dots = [];
            com.show();
            com.get("clickAudio").play();
            setTimeout("play.AIPlay()", 500);
        } else {
            //alert("不能这么走哦！")
        }
    }
}
//Ai自动走棋
play.AIPlay = function () {
    play.my = -1;//电脑执子
        //从符合条件的翻的棋子中点击一个
    var map=com.arr2Clone(play.map);
        var mans=[];
	    for (var i=0; i<map.length; i++){
		    for (var n=0; n<map[i].length; n++){
			    var key = map[i][n];
			    if (key && play.mans[key].y < 5&&play.mans[key].IsFan)
                {
				    play.mans[key].x = n;
				    play.mans[key].y = i;
				    mans.push(play.mans[key])
			    }
		    }
	    }
        if(mans.length==0){
             //走子
        var pace = AI.init(play.pace.join(""))//获得ai初始化的步
        if (!pace) {
            play.showWin(1);
            return;
        }
        play.pace.push(pace.join(""));
        var key = play.map[pace[1]][pace[0]]
        play.nowManKey = key;
        var key = play.map[pace[3]][pace[2]];
        if (key) {
            play.AIclickMan(key, pace[2], pace[3]);
        } else {
            play.AIclickPoint(pace[2], pace[3]);
        }
        com.get("clickAudio").play();
        }else{
         const randomIndex = Math.floor( Math.random()* mans.length);
         var mani=mans[randomIndex];
          play.mans[mani.key].IsFan=false;
          com.show();
          com.get("clickAudio").play();
          play.my = 1;
        }
}
//检查是否长将
play.checkFoul = function () {
    var p = play.pace;
    var len = parseInt(p.length, 10);
    if (len > 11 && p[len - 1] == p[len - 5] && p[len - 5] == p[len - 9]) {
        return p[len - 4].split("");
    }
    return false;
}
//点击事件
play.AIclickMan = function (key, x, y) {
    var man = com.mans[key];
    //if(man.IsFan){
      //  man.IsFan=false;
        //BB.push(key);
        //com.loadImages(com.page);
    //}
    //else
    {
        //吃子
        man.isShow = false;
        delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
        play.map[y][x] = play.nowManKey;
        play.showPane(com.mans[play.nowManKey].x, com.mans[play.nowManKey].y, x, y)
        com.mans[play.nowManKey].x = x;
        com.mans[play.nowManKey].y = y;
        play.nowManKey = false;
        com.show()
        if (key == "j0") play.showWin(-1);
        if (key == "J0") play.showWin(1);
    }
}
play.AIclickPoint = function (x, y) {
    var key = play.nowManKey;
    var man = com.mans[key];
    if (play.nowManKey) {
        delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];
        play.map[y][x] = key;
        com.showPane(man.x, man.y, x, y)
        man.x = x;
        man.y = y;
        play.nowManKey = false;
    }
    com.show();
}
//是否存在着点
play.indexOfPs = function (ps, xy) {
    for (var i = 0; i < ps.length; i++) {
        if (ps[i][0] == xy[0] && ps[i][1] == xy[1]) return true;
    }
    return false;
}
//获得点击的着点
play.getClickPoint = function (e) {
    var domXY = com.getDomXY(com.canvas);
    var x = Math.round((e.pageX - domXY.x - com.pointStartX - 20) / com.spaceX)
    var y = Math.round((e.pageY - domXY.y - com.pointStartY - 20) / com.spaceY)
    return {"x": x, "y": y}
}
//获得棋子
play.getClickMan = function (e) {
    var clickXY = play.getClickPoint(e);
    var x = clickXY.x;
    var y = clickXY.y;
    if (x < 0 || x > 8 || y < 0 || y > 9) return false;
    return (play.map[y][x] && play.map[y][x] != "0") ? play.map[y][x] : false;
}
play.showWin = function (my) {
    play.isPlay = false;
    if (my === 1) {
        window.external.notify("恭喜你，你赢了！");
    } else {
        window.external.notify("很遗憾，你输了！");
    }
}
