$(document).ready(function(){
	var color1 = "",
		color2 = "",//两次鼠标点击对象的颜色
		coordinate1 = "",
		coordinate2 = "",//点击对象的坐标
		clearBox = [],//存储准备剪掉的扣子
		stepBox = [],//记录每次剪掉的扣子数
		returnBox = [],//存储已经剪掉的扣子
		tmpBox = [],//存放中间扣子的临时数组
		clearIndex = 0,//每次点击时追加后的扣子数
		stepIndex =0,//一组点击时剪掉的扣子数
		index = "";
	//剪扣子
	function cutBtnFlash(stepIndex){
		var box =[],
			num = stepIndex;
		for(var i = 0;i<num;i++){
			box[i] = clearBox[clearIndex-i-1];
		}
		box.sort();
		for(var i=0;i<num;i++){			
			$("#"+box[i]).addClass("fork").children().fadeOut().detach();
		}
		clearData();
	}	
	//是否执行cutBtn
	function cutYesNo(){
		if(tmpBox.length != 0){//说明点击有效执行cutbtn
			for (var i = tmpBox.length - 1; i >= 0; i--) {
				clearBox[clearIndex] = tmpBox[i];
				clearIndex++;
				stepIndex++;
			};
			tmpBox.length = 0;//用完后清空方便之后再用
			cutBtnFlash(stepIndex);
			stepIndex = 0;
		}		
	}
	//获取夹在中间的扣子 斜线
	function getDiagonalBtns(coorX, coorY){
		var step =coorX != 0 ? coorX - 1 : coorY - 1;//获取中间相隔几个扣子
		tmpBox.push(coordinate1, coordinate2);
		tmpBox.sort();
		var Y1 = parseInt(tmpBox[0].substring(2,3)),
			Y2 = parseInt(tmpBox[1].substring(2,3)),//获取扣子的纵坐标
			X1 = parseInt(tmpBox[0].substring(1,2)),
			X2 = parseInt(tmpBox[1].substring(1,2));
		switchDire();
		function judgementDire(){//判断直线的方向
			if(coorX == coorY && Y2 > Y1){return 'leftRight' ;}//从左往右的斜线
			else if(coorX == coorY && Y2 < Y1){return 'RightLeft';}//从右往左的斜线
			else if(coorX == 0){return 'horizontalLine';}//横线
			else if(coorY == 0){return 'verticalLine';}//竖线			
		}
		function  legitimateBtn(){//判断中间扣子是不是合法
			if ($('#' + tmpBox[tmpBox.length-1]).children().length == 0) {//中间没有扣子,删除最后一个进来的
				tmpBox.pop();
			}
			else if($('#' + tmpBox[tmpBox.length-1]).children().attr("class") != color1){//夹在中间的扣子颜色不一致,点击无效
				tmpBox.length = 0;
				//break;
			};
		}
		function switchDire(){//不同方向不同对策
			switch(judgementDire()){
				case 'leftRight'://alert('从左往右的斜线');
					for (var i = 0; i <=step - 1; i++) {
						tmpBox.push('l' + (X1 + i + 1) + (Y1 + i + 1));
						legitimateBtn();
					};
					cutYesNo();
				break;
				case 'RightLeft'://alert('从右往左的斜线');
					for (var i = 0; i <=step - 1; i++) {
						tmpBox.push('l' + (X1 + i + 1) + (Y1 - i - 1));
						legitimateBtn();
					};
					cutYesNo();
				break;
				case 'horizontalLine'://alert('横线');
					for (var i = 0; i <=step - 1; i++) {
						tmpBox.push('l' + coordinate1x + (Y1 + i + 1));
						legitimateBtn();
					};
					cutYesNo();
				break;
				case 'verticalLine'://alert('竖线');
					for (var i = 0; i <=step - 1; i++) {
						tmpBox.push('l' + (X1 + i + 1) + coordinate1y);
						legitimateBtn();
					};
					cutYesNo();
				break;
			}
		}		
	}
	//获取始末两点
	function addCoordinate(){		
		clearBox[clearIndex] = coordinate1;
		clearIndex++;
		clearBox[clearIndex] = coordinate2;
		clearIndex++;
		stepIndex = stepIndex+2;
	}
	//判断两次点击是否合法
	function yesNo(){
		coordinate1x = coordinate1.substring(1,2);
		coordinate1y = coordinate1.substring(2,3);
		coordinate2x = coordinate2.substring(1,2);
		coordinate2y = coordinate2.substring(2,3);
		//取横坐标的绝对值
		var coorX = (coordinate2x - coordinate1x) < 0 ? coordinate1x - coordinate2x : coordinate2x - coordinate1x;
		//取纵坐标的s绝对值
		var coorY = (coordinate2y - coordinate1y) < 0 ? coordinate1y - coordinate2y : coordinate2y - coordinate1y;
		//判断是否为直线
		if (coorX==coorY) {//是对角线
			//判断两个点之间是否有其他的点
			if(coorX ==1)//说明两个点相邻
			{
				addCoordinate();
				cutBtnFlash(2);
			}
			else{//不相邻(coorX == coorY >2)
				getDiagonalBtns(coorX, coorY);
				//alert("对角但是不相邻");
				clearData();
			}
		}
		if(coorX==0||coorY==0){//是竖线或者横线
			if(coorX == 0){//横线
				if(coorY == 1){//相邻
					addCoordinate();
					cutBtnFlash(2);
				}
				else{//不相邻(coorX == 0 coorY >= 2)
					getDiagonalBtns(coorX, coorY);
				}
			}
			else{//竖线
				if(coorX == 1){//相邻
					addCoordinate();
					cutBtnFlash(2);
				}
				else{//不相邻(coorX <= 2 coorY == 0)
					getDiagonalBtns(coorX, coorY);
				}
			}
		}	
	}
	//清空数据,从头开始
	function clearData(){
		$("#"+coordinate2).add($("#"+coordinate1)).removeClass("active");//取消选择
		color1 = color2 = coordinate1 = coordinate2 = "";
	}
	//获取点击数据
	$("span").click(function(){
		//判断是奇次点击还是偶次点击
		if(color1==""){//开始的第一次点击
			$(this).parent().addClass("active");
			color1 = $(this).attr("class");
			coordinate1 = $(this).parent().attr("id");
		}else{
			if(color2=="")//开始的第二次点击			
			{
				//判断与上次点击是否为同一个对象
				coordinate2 = $(this).parent().attr("id");
				if(coordinate1==coordinate2)//是
				{
					$(this).parent().removeClass("active");//取消选择
					clearData();	
				}
				else//否
				{					
					$(this).parent().addClass("active");
					color2 = $(this).attr("class");
					//判断是否颜色一致，不一致直接返回
					if(color1 == color2){//颜色一样
						coordinate2 = $(this).parent().attr("id");
						//调用判断函数yesNo()
						yesNo();
					}
					else{//颜色不一样，取消当前选择，重新选择现在的对象						
						clearData();
						$(this).parent().addClass("active");
						color1 = $(this).attr("class");
						coordinate1 = $(this).parent().attr("id");
					}
				}
			}
		}
	});
});