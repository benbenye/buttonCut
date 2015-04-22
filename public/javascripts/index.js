/**
 * Created by bby on 15/4/21.
 */
$(function(){
    // $(window).resize(function(){
    // 	var _wid = $('.btn').width(),
    // 		_hei = _wid/bo.dimensionHorizon;

    // 	$('.btn').each(function(i){
    // 		$(this).css({
    // 			top : Math.floor(i / bo.dimensionHorizon) * _wid,
    // 			left : i % bo.dimensionHorizon * _wid
    // 		})
    // 	});
    // 	$('.btn span').height(_wid);
    // });

    function Game(){
        this.model = 'normal';
        this.init();
    }
    Game.prototype.init = function () {
        var _this = this;
        $('#submit').on('click', function(){
            var _name = $('#input').val();
            // 提交用户昵称之后才开始游戏
            if(!_name){
                alert('请输入昵称以开始游戏！');
            }else{
                $.post('/postuser', {name:_name},function(data){
                    //if(data.islogined){
                    //    // 已有用户操作
                    //    _this.showLevels(data);
                    //}else{
                    //    // 新用户初始化
                    //    console.log(data);
                    //    var bo = new BtnBoard(8,4,5,640,'#mainBox','#mainUl');
                    //    $('#mainBox').show();
                    //}
                    _this.showLevels(data);
                },'json');
            }
        });
    };

    Game.prototype.showLevels = function (data){
        var _this = this;
        $('#username').text(data.name);
        $('#staus').text('游戏进度：总分'+data.score+',当前关卡'+data.level);
        $('#login').hide();
        $('#levels').show();
        $('#normalModule').click(function () {
            _this.model = 'normal';
            _this.showNormalModule();
        });
    };

    Game.prototype.showNormalModule = function () {
        var _this = this,
            _json = '';

        // 传统模式地图
        $.getJSON('/javascripts/normalMap.json', function (json) {
            _json = json;
            _this.showMap(json);
        });
    };
    
    
    Game.prototype.showMap = function (json) {
        // 清除空数据
        _this = this;
        if(json.length){
            for(var i = 0; i < json.length; ++i){
                if(!json[i].length){
                    json.splice(i,1);
                }
            }
           console.log(json);
        }
        var _dom = '';
        for(var i = 0, l = json.length; i < l; ++i){
            _dom += '<li class="mapLi">'+ (i+1) +'</li>'
        }
        $('.levelMap').append(_dom).show().find('li').click(function(){
            var _index = $(this).index();

            new BtnBoard(8,4,5,$(window).width(),'#mainBox','#mainUl',_this.model, json[_index]);
        });


    };


    new Game();
});
