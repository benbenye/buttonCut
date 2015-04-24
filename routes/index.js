var express = require('express');
var router = express.Router();
var User = require('../modules/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '剪吧' });
});
router.post('/postuser', function(req, res, next){
	User.checkName({name:req.body.name},function(err, data){
		if(err){
			console.log(err.message);
		}else{
			if(data.islogined){
				// 已有此用户的信息
				res.send(data);
			}else{
				var newUser = new User({
					name: req.body.name
				});
				newUser.save(function(err, user){
					if(err){
						console.log(err.message); 	
					}else{
						res.send(user);
					}
				});
			}
		}
	});
});
module.exports = router;
