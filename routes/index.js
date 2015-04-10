var express = require('express');
var router = express.Router();
var User = require('../modules/btns.js');
console.log(User);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bby剪扣子游戏' });
});
router.post('/postuser', function(req, res, next){
	console.log(req.body);
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
});
module.exports = router;
