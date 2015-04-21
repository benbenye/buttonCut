$(function(){
	/*
	* powered by bby
	* https://github.com/benbenye
	* http://blog.csdn.net/wmzy1067111110
	*/

	/*
	* @name   棋盘
	* @param h  横向维度
	* @param v  纵向维度
	* @param boxWid  棋盘宽度，用于当棋盘宽度发生变化时，调节棋盘布局（暂不使用）
	* @param n  棋子颜色种类数
	* @param elemBox   元素父级
	* @param elemUl    用于添加棋子的ul
	*/
	function BtnBoard(h, v, n, boxWid, elemBox, elemUl){
		this.dimensionHorizon = h || 5;
		this.dimensionVertical = v || 4;
		this.colorNums = n || 3;
		this.boxWid = boxWid || 320;
		this.fromTo = [];
		this.needCutBtnArr = [];
		this.mainBox = elemBox || 'mainBox';
		this.mainUl = elemUl || 'mailUl';
		this._init();
	}

	BtnBoard.prototype._init = function() {
		/*
		* 初始化棋盘
		* 实现棋盘的初始化
		* 传入的维度参数不符合的话，使用默认维度
		* onEventClick: dom渲染，绑定棋子的点击事件
		*/
		var _this = this;

		if(!(_this.dimensionHorizon === +_this.dimensionHorizon && _this.dimensionVertical === +_this.dimensionVertical)){

			_this.dimensionHorizon = _this.dimensionVertical = 4;
		}
		_this.btnArr = [];

		for(var i = 0; i < _this.dimensionHorizon; ++i){
			_this.btnArr[i] = [];
		}

		// 渲染到dom,<li id="l04"><span class="r"></span></li>
		var _temDom = '';
		for(var i = 0; i < _this.dimensionVertical; ++i){
			for(var j = 0; j <_this.dimensionHorizon; ++j){
				// 随机棋盘
				_this.btnArr[j][i] = Math.floor(Math.random() * _this.colorNums);
				var _widPer = 100/_this.dimensionHorizon,
					_hei = (_this.boxWid/_this.dimensionHorizon),
					_top = _hei * i,
					_left = _widPer * j;
				_temDom += '<li class="btn" style="width:'+_widPer+'%; top:'+_top+'px; left:'+_left+'%"><span class="c'+_this.btnArr[j][i]+'" style="height:'+_hei+'px"></span></li>'
			}
		}
		$(_this.mainBox).css({width:_this.boxWid});
		$(_this.mainUl).html(_temDom);
		_this.onEventClick('.btn');
	};

	BtnBoard.prototype.onEventClick = function(elem) {
		var _dom = $(elem) || elem,
			_this = this;
		_dom.on('click', function(){
			i = $(this).index(),
			x = i % _this.dimensionHorizon,
			y = Math.floor(i / _this.dimensionHorizon),
			btnObj = {
				x : x,
				y : y,
				colorNum : _this.btnArr[x][y]
			};

			if(_this.canCutBtn(btnObj)){
				// 符合
				_this.cutBtn();
			}
		});
	};

	/*
	* 棋盘操作的UI层
	* cutUI 只负责棋盘的UI层面的变化，不涉及到数据存储
	* addBtnSelected: 给选中棋子添加选中效果
	*               ====@parame   x    棋子的x坐标
	*               ====@parame   y    棋子的y坐标
	* deleteDom: 将符合条件的棋子从dom中删除
	*               ====@parame   that  当前棋盘对象
	*/
	BtnBoard.prototype.cutUI = {
		addBtnSelected : function(x, y, that){
			var i = y * that.dimensionHorizon + x;
			$('.btn:eq('+i+')').addClass('active').siblings().removeClass('active');
		},
		deleteDom : function(that){
			for(var i = 0, l = that.needCutBtnArr.length; i < l; ++i){
				var o = that.needCutBtnArr[i].y * that.dimensionHorizon + that.needCutBtnArr[i].x,
					o = '.btn:eq('+o+')';
				$(o).hide();
			}
			that.fromTo = [];
			that.needCutBtnArr = [];
		}
	};

	/*
	* 判断两个棋子是否有效
	* 借助this.formTo this.needCutBtnArr 两个数组
	*@parame   btnObj    点击的最新的一个棋子
	*/
	BtnBoard.prototype.canCutBtn = function(btnObj){

		if(this.fromTo.length === 0){
			// 新游戏
			this.fromTo.push(btnObj);
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
							this.cutUI.addBtnSelected(btnObj.x, btnObj.y, this);
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
							this.cutUI.addBtnSelected(btnObj.x, btnObj.y, this);
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
							if(this.btnArr[x1][y1] !== +this.btnArr[x1][y1] ){
								++x1;
								++y1;
								continue;
							}else if(this.btnArr[x1][y1] !== btnObj.colorNum){
								this.cutUI.addBtnSelected(btnObj.x, btnObj.y,this);
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
								++x1;
								--y1;
								continue;
							}else if(this.btnArr[x1][y1] !== btnObj.colorNum){
								this.cutUI.addBtnSelected(btnObj.x, btnObj.y,this);
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
					this.cutUI.addBtnSelected(btnObj.x, btnObj.y,this)
					this.fromTo[0] = btnObj;
					return false;
				}
			}else{
				console.log('colorNum is diffrent!');
				this.cutUI.addBtnSelected(btnObj.x, btnObj.y,this)
				this.fromTo[0] = btnObj;
				return false;
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
	window.BtnBoard = BtnBoard;
});
