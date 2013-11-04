$(document).ready(function(){
	var color1 = "",
		color2 = "",//两次鼠标点击对象的颜色
		coordinate1 = "",
		coordinate2 = "",//点击对象的坐标
		clearBox = [],//存储准备剪掉的扣子
		stepBox = [],//记录每次剪掉的扣子数
		returnBox = [],//存储已经剪掉的扣子
		clearIndex = 0,
		stepIndex =0,
		indexNew =0,
		index = "";
	//剪扣子
	function cutBtnFlash(indexNew){
		var box =[],
			num = indexNew;
		for(var i = 0;i<num;i++){
			box[i] = clearBox[clearIndex-i-1];
		}
		box.sort();
		for(var i=0;i<num;i++){			
			$("#"+box[i]).addClass("fork").children().fadeOut().detach();
		}
		clearData();
	}
	//获取夹在中间的扣子
	function getButtons(coorX,coorY){
		var start =0,
			id = "",
			flag =0,
			//indexNew = 0,//此次扣子数
			coorXoY = 0,
			XoY = 0;
		coorX = parseInt(coorX);
		coorY = parseInt(coorY);
		if(coorX){//竖线
			start = parseInt((coordinate2x - coordinate1x) > 0 ? coordinate1x : coordinate2x);
			coorXoY = coorX;
			XoY = coordinate1y;
		}else{//横线
			start = parseInt((coordinate2y - coordinate1y) > 0 ? coordinate1y : coordinate2y);
			coorXoY = coorY;
			XoY = coordinate1x;
		}

		for (var i = start; i < (coorXoY+start-1); i++) {
			if(color1 == $("#l"+(i+1)+XoY).children().attr("class")){//取得加在中间的扣子颜色
				flag = 1;
			}else{
				if( $("#l"+(i+1)+XoY).children().length != 0){
					clearData();
				}else{
					flag=2;
				}
			}
			if(flag==1){
				id = "l"+(i+1)+XoY;
				clearBox[clearIndex] = id;
				clearIndex++;
				indexNew++;
			}							
		};
		addCoordinate();	
		if(indexNew>2){
			cutBtnFlash(indexNew);
		}else{
			cutBtnFlash(2);
		}
	}
	//获取始末两点
	function addCoordinate(){		
		clearBox[clearIndex] = coordinate1;
		clearIndex++;
		clearBox[clearIndex] = coordinate2;
		clearIndex++;
		indexNew = indexNew+2;
	}
	//判断两次点击是否合法
	function yesNo(){
			coordinate1x = coordinate1.substring(1,2);
			coordinate1y = coordinate1.substring(2,3);
			coordinate2x = coordinate2.substring(1,2);
			coordinate2y = coordinate2.substring(2,3);
			//取横坐标的绝对值
			var coorX = (coordinate2x - coordinate1x) < 0 ? coordinate1x - coordinate2x : coordinate2x - coordinate1x;
			//取纵坐标的绝对值
			var coorY = (coordinate2y - coordinate1y) < 0 ? coordinate1y - coordinate2y : coordinate2y - coordinate1y;
			//判断是否为直线
			if (coorX==coorY) {//是对角线
				//判断两个点之间是否有其他的点
				if(coorX ==1)//说明两个点相邻
				{
					addCoordinate();
					cutBtnFlash(2);
				}
				else{//不相邻
					alert("对角但是不相邻");
					clearData();
				}
			}
			if(coorX==0||coorY==0){//是竖线或者横线
				if(coorX == 0){//横线
					if(coorY == 1){//相邻
						addCoordinate();
						cutBtnFlash(2);
					}
					else{//不相邻
						getButtons(coorX,coorY);
					}
				}
				else{//竖线
					if(coorX == 1){//相邻
						addCoordinate();
						cutBtnFlash(2);
					}
					else{//不相邻
						getButtons(coorX,coorY);
					}
				}
			}	
	}
	//清空数据，从头开始
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