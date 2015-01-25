$(function(){

	/*
	* powered by bby
	* https://github.com/benbenye
	*/

	/*
	*@name   棋盘
	*@parame h  横向维度
	*@parame v  纵向维度
	*/
	function BtnBoard(h, v, n,windowWid){
		this.dimensionHorizon = h;
		this.dimensionVertical = v;
		this.colorNums = n;
		this.windowWid = windowWid;
		this.fromTo = [];
	}

	BtnBoard.prototype._init = function() {
		// 初始化棋盘
		if(this.dimensionHorizon === +this.dimensionHorizon && this.dimensionVertical === +this.dimensionVertical){

			this.btnArr = new Array();

		}else{

			this.dimensionHorizon = this.dimensionVertical = 4;
			this.btnArr = new Array();
		}
		for(var i = 0; i < this.dimensionHorizon; ++i){
			this.btnArr[i] = new Array();
		}

		// 渲染到dom,<li id="l04"><span class="r"></span></li>
		var _temDom = '';
		for(var i = 0; i < this.dimensionVertical; ++i){
			for(var j = 0; j <this.dimensionHorizon; ++j){
				// 随机棋盘
				this.btnArr[j][i] = Math.floor(Math.random() * this.colorNums);
				var _widPer = 100/this.dimensionHorizon,
					_hei = (this.windowWid/this.dimensionHorizon),
					_top = _hei * i,
					_left = _widPer * j;
				_temDom += '<li class="btn" style="width:'+_widPer+'%; top:'+_top+'px; left:'+_left+'%"><span class="c'+this.btnArr[j][i]+'" style="height:'+_hei+'px"></span></li>'
			}
		}

		$('#mainUl').html(_temDom);
	};

	BtnBoard.prototype.cutBtn = function(obj, arr){
		for(var i = 0, l = arr.length; i < l; ++i){
			obj.btnArr[arr[i].x][arr[i].y] = null;
			// delete dom
			$('.btn').eq(arr[i].y * obj.dimensionHorizon + arr[i].x).remove();
		}
	};

	var bo = new BtnBoard(8,4,5,$(window).width());
	bo._init();
	window.bo = bo;	
	$('.btn').on('click',function(){
		var i = $(this).index(),
			x = i % bo.dimensionHorizon,
			y = Math.floor(i / bo.dimensionHorizon),
			btnObj = {
				x : x,
				y : y,
				colorNum : bo.btnArr[x][y]
			};
		console.log(btnObj);
		console.log(bo.btnArr);
		if(bo.fromTo.length === 0){
			// 新游戏
			bo.fromTo.push(btnObj);
			// addSeleClass();
			$(this).addClass('active');
		}else{
			// if the colorNum is same
			if(bo.fromTo[0].colorNum === btnObj.colorNum){
				if(bo.fromTo[0].x === btnObj.x){
					var _tempArr = [];
					_tempArr.push(bo.fromTo[0]);
					for(var i = Math.min(bo.fromTo[0].y, btnObj.y), l = Math.abs(bo.fromTo[0].y - btnObj.y); i < l; ++i){
						console.log(i+':'+l);
						if(bo.btnArr[btnObj.x][i] !== btnObj.colorNum){
							console.log('there is diffrent btn in the one line');
							$(this).addClass('active').siblings().removeClass('active');
							bo.fromTo[0] = btnObj;
							_tempArr = [];
							break;
						}else{
							_tempArr.push({
								x : btnObj.x,
								y : i,
								colorNum : bo.btnArr[btnObj.x][i]
							});
						}
					}
					if(_tempArr.length){
						_tempArr.push(btnObj);
						console.log(_tempArr);
						bo.cutBtn(bo, _tempArr);
					}else{
						// return the one btn is selected
						return;
					}
				}else if(bo.fromTo[0].y === btnObj.y){

				}else if(Math.abs(bo.fromTo[0].x - btnObj.x) === Math.abs(bo.fromTo[0].y - btnObj.y)){

				}else{
					console.log('not a line!');
					$(this).addClass('active').siblings().removeClass('active');
					bo.fromTo[0] = btnObj;
					return;
				}
			}else{
				console.log('colorNum is diffrent!');
				$(this).addClass('active').siblings().removeClass('active');
				bo.fromTo[0] = btnObj;
				return;
			}
			
		}
	});

	$(window).resize(function(){
		var _wid = $('.btn').width(),
			_hei = _wid/bo.dimensionHorizon;
			// _top = _hei * i,
			// _left = _widPer * j;
		$('.btn').each(function(i){
			$(this).css({
				top : Math.floor(i / bo.dimensionHorizon) * _wid,
				left : i % bo.dimensionHorizon * _wid
			})
		});
		$('.btn span').height(_wid);
	})
});
