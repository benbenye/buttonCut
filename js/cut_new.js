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
		this.needCutBtnArr = [];
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

	BtnBoard.prototype.cutUI = {
		addBtnSelected : function(x, y, that){
			var i = y * that.dimensionHorizon + x;
			$('.btn:eq('+i+')').addClass('active').siblings().removeClass('active');
		},
		deleteDom : function(that){
			for(var i = 0, l = that.needCutBtnArr.length; i < l; ++i){
				console.log();
				var o = that.needCutBtnArr[i].y * that.dimensionHorizon + that.needCutBtnArr[i].x,
					o = '.btn:eq('+o+')';
				console.log($('.btn:eq('+o+')'));
				$(o).hide();
			}
			that.fromTo = [];
			that.needCutBtnArr = [];
		}
	};

	BtnBoard.prototype.canCutBtn = function(btnObj){

		if(this.fromTo.length === 0){
			// 新游戏
			this.fromTo.push(btnObj);
			// addSeleClass();
			console.log('s1');
			this.cutUI.addBtnSelected(btnObj.x, btnObj.y, this);
		}else if(this.fromTo[0].x === btnObj.x && this.fromTo[0].y === btnObj.y){
			// 点击的同一个扣子
			return;
		}else{
			// 如果颜色相同
			if(this.fromTo[0].colorNum === btnObj.colorNum){
				// 都在x轴上
				if(this.fromTo[0].x === btnObj.x){
					this.needCutBtnArr.push(this.fromTo[0]);
					for(var i = Math.min(this.fromTo[0].y, btnObj.y), l = Math.max(this.fromTo[0].y, btnObj.y); i <= l; ++i){
						console.log(i+':'+l);
						if(this.btnArr[btnObj.x][i] !== +this.btnArr[btnObj.x][i]){
							continue;
						}else if(this.btnArr[btnObj.x][i] && this.btnArr[btnObj.x][i] !== btnObj.colorNum){
							console.log('中间有不同颜色的扣子');
							this.cutUI.addBtnSelected(btnObj.x, btnObj.y);
							this.fromTo[0] = btnObj;
							this.needCutBtnArr = [];
							break;
						}else{
							this.needCutBtnArr.push({
								x : btnObj.x,
								y : i,
								colorNum : this.btnArr[btnObj.x][i]
							});
						}
					}

					if(this.needCutBtnArr.length){
						this.needCutBtnArr.push(btnObj);
						console.log(this.needCutBtnArr);
						return true;
					}else{
						return false;
					}
				}else if(this.fromTo[0].y === btnObj.y){
					for(var i = Math.min(this.fromTo[0].x, btnObj.x), l = Math.max(this.fromTo[0].x, btnObj.x); i <= l; ++i){
						console.log(this.btnArr[i][btnObj.y]);
						if(this.btnArr[i][btnObj.y] !== +this.btnArr[i][btnObj.y]){//空位置怎么办了？
							console.log('kong')
							continue;
						}else if(this.btnArr[i][btnObj.y] !== btnObj.colorNum){
							console.log('中间有不同颜色的扣子');
							this.cutUI.addBtnSelected(btnObj.x, btnObj.y);
							this.fromTo[0] = btnObj;
							this.needCutBtnArr = [];
							break;
						}else{
							this.needCutBtnArr.push({
								x : i,
								y : btnObj.y,
								colorNum : this.btnArr[i][btnObj.y]
							});
						}
					}
					if(this.needCutBtnArr.length){
						// this.needCutBtnArr.push(btnObj);
						console.log(this.needCutBtnArr);
						return true;
					}else{
						return false;
					}
				}else if(Math.abs(this.fromTo[0].x - btnObj.x) === Math.abs(this.fromTo[0].y - btnObj.y)){
					console.log('斜对角线');
					console.log(this.fromTo[0])
					console.log(btnObj)
					if(this.fromTo[0].x - btnObj.x === this.fromTo[0].y - btnObj.y){
						// 斜向下的对角线
						for(var x1 = Math.min(this.fromTo[0].x, btnObj.x),
								x2 = Math.max(this.fromTo[0].x, btnObj.x),
								y1 = Math.min(this.fromTo[0].y, btnObj.y),
								y2 = Math.max(this.fromTo[0].y, btnObj.y);
								x1 <= x2 && y1 <= y2;){
							if(this.btnArr[x1][y1] !== +this.btnArr[x1][y1]){
								continue;
							}else if(this.btnArr[x1][y1] !== btnObj.colorNum){
								this.cutUI.addBtnSelected(btnObj.x, btnObj.y);
								this.fromTo[0] = btnObj;
								this.needCutBtnArr = [];
								break;
							}else{
								this.needCutBtnArr.push({
									x : x1,
									y : y1,
									colorNum : btnObj.colorNum
								});
							}
							++x1;
							++y1;
						}
					}else{
						for(var x1 = Math.min(this.fromTo[0].x, btnObj.x),
								x2 = Math.max(this.fromTo[0].x, btnObj.x),
								y2 = Math.min(this.fromTo[0].y, btnObj.y),
								y1 = Math.max(this.fromTo[0].y, btnObj.y);
								x1 <= x2 && y1 >= y2;){
							if(this.btnArr[x1][y1] !== +this.btnArr[x1][y1]){
								continue;
							}else if(this.btnArr[x1][y1] !== btnObj.colorNum){
								this.cutUI.addBtnSelected(btnObj.x, btnObj.y);
								this.fromTo[0] = btnObj;
								this.needCutBtnArr = [];
								break;
							}else{
								this.needCutBtnArr.push({
									x : x1,
									y : y1,
									colorNum : btnObj.colorNum
								});
							}
							++x1;
							--y1;
						}
					}
						if(this.needCutBtnArr.length){
							return true;
						}else{
							return false;
						}
				}else{
					console.log('not a line!');
					$(this).addClass('active').siblings().removeClass('active');
					this.fromTo[0] = btnObj;
					return;
				}
			}else{
				console.log('colorNum is diffrent!');
				$(this).addClass('active').siblings().removeClass('active');
				this.fromTo[0] = btnObj;
				return;
			}	
		}
	};

	BtnBoard.prototype.cutBtn = function(){
		// 删除二维数组里面对应的btn
		for(var i = 0, l = this.needCutBtnArr.length; i < l; ++i){
			this.btnArr[this.needCutBtnArr[i].x][this.needCutBtnArr[i].y] = null;
		}
		this.cutUI.deleteDom(this);
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

		if(bo.canCutBtn(btnObj)){
			// 符合
			console.log('ok');
			bo.cutBtn();
		}else{
			//  do nothing
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
