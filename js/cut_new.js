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
		this.colors = n;
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

		// this.btnArr.forEach(function(that){
		// 	that = new Array(this.dimensionVertical);
		// 	that.forEach(function(_that){
		// 		// 随机棋盘
		// 		_that = Math.floor(Math.random() * this.colors);
		// 	});
		// });

		// 渲染到dom
			// <li id="l04"><span class="r"></span></li>
		var _temDom = '';
		for(var i = 0; i < this.dimensionVertical; ++i){
			for(var j = 0; j <this.dimensionHorizon; ++j){
				// 随机棋盘
				this.btnArr[j][i] = Math.floor(Math.random() * this.colors);
				var _widPer = 100/this.dimensionHorizon,
					_hei = (this.windowWid/this.dimensionHorizon),
					_top = _hei * i,
					_left = _widPer * j;
				_temDom += '<li class="btn" style="width:'+_widPer+'%; top:'+_top+'px; left:'+_left+'%"><span class="c'+this.btnArr[j][i]+'" style="height:'+_hei+'px"></span></li>'
			}
		}

		$('#mainUl').html(_temDom);
	};

	var bo = new BtnBoard(5,5,5,$(window).width());
	bo._init();

	$('.btn').on('click',function(){
		var i = $(this).index(),
			x = i % bo.dimensionHorizon,
			y = i / bo.dimensionHorizon;

		if(bo.fromTo.length === 0){
			// 新游戏
			bo.fromTo.push();
		}
	});

	$(window).resize(function(){
		var _wid = $('.btn').width();

		$('.btn').css('top',_wid);
		$('.btn span').height(_wid);
	})
})