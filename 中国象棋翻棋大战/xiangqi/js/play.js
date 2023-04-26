var play = play || {};
play.init = function () {
    play.my = 1;									//��ҷ�
    play.map = com.arr2Clone(com.initMap);		//��ʼ������
    play.nowManKey = false;								//����Ҫ����������
    play.pace = [];									//��¼ÿһ��
    play.isPlay = true;								//�Ƿ�������
    play.mans = com.mans;							//���Ӽ���
    play.bylaw = com.bylaw;							//�������ߵ��ŵ�
    play.show = com.show;							//��ʾ���
    play.showPane = com.showPane;						//��ʾ����
    play.isOffensive = true;								//�Ƿ�����
    play.depth = play.depth || 3;					//�������
    play.isFoul = false;								//�Ƿ񷸹泤��
    com.pane.isShow = false;								//���ط���
    for (var i = 0; i < play.map.length; i++) {						//��ʼ������->����play.map����com.mans
        for (var n = 0; n < play.map[i].length; n++) {
            var key = play.map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }
    play.show();												//��ʾ���
    //�󶨵���¼�
    com.canvas.addEventListener("click", play.clickCanvas)		//������ӵ���¼�
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
    com.get("regretBn").addEventListener("click", function (e) {			//����
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
play.regret = function () {										//����
    var map = com.arr2Clone(com.initMap);						//��¡��ͼ
    for (var i = 0; i < map.length; i++) {							//��ʼ����������->����map����com.mans
        for (var n = 0; n < map[i].length; n++) {
            var key = map[i][n];
            if (key) {
                com.mans[key].x = n;
                com.mans[key].y = i;
                com.mans[key].isShow = true;
            }
        }
    }
    var pace = play.pace;//ÿһ��
    pace.pop();//JavaScript�� pop() ���������Ƴ������������е����һ��Ԫ�ء��÷�����ı�ԭ���顣
    pace.pop();
    for (var i = 0; i < pace.length; i++) {//����ÿһ��
        var p = pace[i].split("")//������һ�����ּ�¼
        var x = parseInt(p[0], 10);//����������x
        var y = parseInt(p[1], 10);//����������y
        var newX = parseInt(p[2], 10);//����������x
        var newY = parseInt(p[3], 10);//����������y
        var key = map[y][x];//��ȡ��ͼ����������
        //try{
        var cMan = map[newY][newX];//������
        if (cMan) com.mans[map[newY][newX]].isShow = false;//��������Ӵ�������ʾ
        com.mans[key].x = newX;
        com.mans[key].y = newY;
        map[newY][newX] = key;//�������Ӳ���
        delete map[y][x];
        if (i == pace.length - 1) {//����������ף�����ʾ���
            com.showPane(newX, newY, x, y)
        }
        //} catch (e){
        //	com.show()
        //	z([key,p,pace,map])
        //	}
    }
    play.map = map;//����play��ͼ
    play.my = 1;//�ֵ���ҷ�����
    play.isPlay = true;//�Ƿ�������
    com.show();//��ʾ���
}
//��������¼�
play.clickCanvas = function (e) {
    if (!play.isPlay) return false;//���������ҷ������򷵻�
    var key = play.getClickMan(e);//��ȡ���������
    var point = play.getClickPoint(e);//�����������
    var x = point.x;
    var y = point.y;
    if (key) {
        play.clickMan(key, x, y);	//������Ӵ���->��������¼�
    } else {
        play.clickPoint(x, y);	//������Ӳ�����->��������¼�
    }
    play.isFoul = play.checkFoul();//����ǲ��ǳ���
}
//������ӣ����������ѡ�л��߳���
play.clickMan = function (key, x, y) {//��������¼�
    var man = com.mans[key];//�õ�key������
    {
    //����
    //	����Ҫ��������	����Ҫ���������ӡٵ��		key������ҷ���Ҫ����������ҷ�
    if (play.nowManKey && play.nowManKey != key && man.my != com.mans[play.nowManKey].my) {
        //if(man.IsFan)
        {
        //manΪ���Ե�������
        if (play.indexOfPs(com.mans[play.nowManKey].ps, [x, y])) {//�Ƿ�����ŵ�
            man.isShow = false;
            var pace = com.mans[play.nowManKey].x + "" + com.mans[play.nowManKey].y//pace����
            //z(bill.createMove(play.map,man.x,man.y,x,y))
            delete play.map[com.mans[play.nowManKey].y][com.mans[play.nowManKey].x];//ɾ����ͼ������
            play.map[y][x] = play.nowManKey;//���µ�ͼ
            com.showPane(com.mans[play.nowManKey].x, com.mans[play.nowManKey].y, x, y)//��ʾ�ƶ����������
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
        // ѡ������
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
            com.mans[key].ps = com.mans[key].bl(); //����������ŵ�
            com.dot.dots = com.mans[key].ps
            com.show();
            //com.get("selectAudio").start(0);
            com.get("selectAudio").play();
        }
         }
    }
    }
}
//����ŵ�
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
            //alert("������ô��Ŷ��")
        }
    }
}
//Ai�Զ�����
play.AIPlay = function () {
    play.my = -1;//����ִ��
        //�ӷ��������ķ��������е��һ��
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
             //����
        var pace = AI.init(play.pace.join(""))//���ai��ʼ���Ĳ�
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
//����Ƿ񳤽�
play.checkFoul = function () {
    var p = play.pace;
    var len = parseInt(p.length, 10);
    if (len > 11 && p[len - 1] == p[len - 5] && p[len - 5] == p[len - 9]) {
        return p[len - 4].split("");
    }
    return false;
}
//����¼�
play.AIclickMan = function (key, x, y) {
    var man = com.mans[key];
    //if(man.IsFan){
      //  man.IsFan=false;
        //BB.push(key);
        //com.loadImages(com.page);
    //}
    //else
    {
        //����
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
//�Ƿ�����ŵ�
play.indexOfPs = function (ps, xy) {
    for (var i = 0; i < ps.length; i++) {
        if (ps[i][0] == xy[0] && ps[i][1] == xy[1]) return true;
    }
    return false;
}
//��õ�����ŵ�
play.getClickPoint = function (e) {
    var domXY = com.getDomXY(com.canvas);
    var x = Math.round((e.pageX - domXY.x - com.pointStartX - 20) / com.spaceX)
    var y = Math.round((e.pageY - domXY.y - com.pointStartY - 20) / com.spaceY)
    return {"x": x, "y": y}
}
//�������
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
        window.external.notify("��ϲ�㣬��Ӯ�ˣ�");
    } else {
        window.external.notify("���ź��������ˣ�");
    }
}
