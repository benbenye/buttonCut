/* global _this */
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/* global BtnBoard */
/**
 * Created by bby on 15/4/21.
 * 此文件是游戏主文件
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
        this.user = {
            name: '',
            score: 0,
            normalModel: {
                level: 1,
                HP: 3
            },
            randomModel: {
                level: 1,
                HP: 3,
                map:[]
            }
        };
        this.normalMap = [];
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
                    if(data.islogined){
                        _this.user = data;
                    }
                    _this.showModels(data);
                },'json');
            }
        });

        //关闭页面判断
        window.onbeforeunload = function() {
             $.post('/postUserInformation',_this.user,function(){
            },'json');
            return "你的文章尚未提交，我们已为你自动保存，确定离开此页面吗？";
        };
    };

    Game.prototype.showModels = function (data){
        var _this = this;
        _this.user.name = data.name;
        var _domModels = '<div id="levels" class="dn"><div id="normalModule" class="btn-module">传统模式</div><div id="randomModule" class="btn-module">随机模式</div></div>',
            _domUser = '<div id="user"><img src="/images/avatar.jpg" width="120" alt="'+data.name+'"/><div class="user-infor"><div class="name">'+data.name+'</div><div class="score">积分：'+data.score+'</div></div></idv>';
        var _dom = _domUser+_domModels;
        $('body').html(_dom);
        $('#levels').show();


        $('#normalModule').click(function () {
            _this.model = 'normal';
            _this.showModule();
        });
        $('#randomModule').click(function () {
            _this.model = 'random';
            _this.showModule();
        });
    };

    Game.prototype.showModule = function () {
        var _this = this;
        if(_this.model === 'normal'){
        // 传统模式地图
            $.getJSON('/javascripts/normalMap.json', function (json) {
                _this.normalMap = json;
                _this.showMap(json);
            });
        }else{
            // 随机模式
            _this.showRandomMap();
        }
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
        }
        var _dom = '';
        for(var i = 0, l = json.length; i < l; ++i){
            _dom += '<li class="mapLi">'+ (i+1) +'</li>'
        }
        _dom = '<ul class="levelMap">'+ _dom +'</div>';
        $('#levels').hide();
        $('body').append(_dom);
        $('.levelMap').show().find('li').click(function(){
            var _index = $(this).index();

            new BtnBoard(json[_index].length,json[_index][0].length,5,$(window).width(),'#mainBox','#mainUl',_this.model, json[_index]);
        });
    };
    
    Game.prototype.showRandomMap = function () {
        
    };

    /*
     * 关卡完成后的提示
     * */
    Game.prototype.finishPassport = function(){
        //  存储数据
        this.user.score += 50;
        this.user.normalModel.level += 1;
        this.updateInfo();
        this.showNextTip();
    };
    Game.prototype.showNextTip = function(){
        var _dom = '<div id="tip" class="dialog-bg"><div class="dialog">恭喜完成<div id="next">进入下一关</div></div><span class="ref"></span></div>',
            _this = this;
        $('body').append(_dom);
        $('#next').click(function(){
            $('#tip').remove();
            _this.nextPassport();
        });
    };
    Game.prototype.updateInfo = function(){
        var _this = this;
        $('#staus').text('游戏进度：总分'+_this.user.score+',当前传统模式关卡'+_this.user.normalModel.level+',当前随机模式关卡'+_this.user.randomModel.level);
    };
    Game.prototype.nextPassport = function () {
        if(this.model === 'normal'){
            var _this = this,
                map = _this.normalMap[_this.user.normalModel.level-1],
                h = map.length,
                v = map[0].length,
                n = 5,
                w = 640;

            new BtnBoard(h, v, n, w, '#mainBox', '#mainUl', _this.model, map);
        }else{
            //new BtnBoard();
        }
    };


    var curGame = new Game();
    window.curGame = curGame;
});
