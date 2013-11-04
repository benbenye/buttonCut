$(document).ready(function(){

	//剪扣子
	function cutBtn(id){
		$("#"+id).children().detach();
		clearData();
		alert("清除一个扣子");
	}
	function cutBtns(coordinate1,coordinate2){
		$("#"+coordinate1).add($("#"+coordinate2)).removeClass(color1);
		clearData();
		clearBox[0] = $("#"+coordinate1).children().detach();
		clearBox[1] = $("#"+coordinate2).children().detach();
		//.........
		alert("清除一对扣子");
	}
	//判断两次点击是否合法
	function yesNo(color1,color2,coordinate1,coordinate2){
			coordinate1x = coordinate1.substring(1,2);
			coordinate1y = coordinate1.substring(2,3);
			coordinate2x = coordinate2.substring(1,2);
			coordinate2y = coordinate2.substring(2,3);
			//取横坐标的绝对值
			if((coordinate2x - coordinate1x) < 0){
				var coorX = -(coordinate2x - coordinate1x);
			}
			else
			{
				var coorX = coordinate2x - coordinate1x;
			}
			//取纵坐标的绝对值
			if((coordinate2y - coordinate1y) < 0){
				var coorY = -(coordinate2y - coordinate1y);
			}
			else
			{
				var coorY = coordinate2y - coordinate1y;
			}

			//判断是否为直线
			if (coorX==coorY) {//是对角线
				//判断两个点之间是否有其他的点
				if(coorX ==1)//说明两个点相邻
				{
					alert("对角相邻");
					cutBtns(coordinate1,coordinate2);//执行剪扣子的函数
				}
				else{//不相邻
					alert("对角但是不相邻");
				}
			}
			if(coorX==0||coorY==0){//是竖线或者横线
				if(coorX == 0){//横线
					if(coorY == 1){//相邻
						cutBtns(coordinate1,coordinate2);
					}
					else{//不相邻
						//判断中间的扣子
					}
				}
				else{//竖线
					if(coorX == 1){//相邻
						cutBtns(coordinate1,coordinate2);
					}
					else{//不相邻
						var start =0,id = "",flag =0,
							Y = coordinate1y;//获取纵坐标
						start = parseInt((coordinate2x - coordinate1x) > 0 ? coordinate1x : coordinate2x);
						coorX = parseInt(coorX);
						for (var i = start; i < (coorX+start-1); i++) {
							if(color1 == $("#l"+(i+1)+Y).children().attr("class")){//取得加在中间的扣子颜色
								flag = 1;
							}else{
								clearData();
							}
							id = "l"+(i+1)+Y;
							cutBtn(id);
						};
						if(flag){
							cutBtns(coordinate1,coordinate2);
						}
					}
				}
			}
	
	}
	var color1 = "";
	var color2 = "";//两次鼠标点击对象的颜色
	var coordinate1 = "";
	var coordinate2 = "";//点击对象的坐标
	var clearBox=[];
	var index = "";
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

						yesNo(color1,color2,coordinate1,coordinate2);
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