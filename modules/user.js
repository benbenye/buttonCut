var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
if (mongoose.readyState === 0 || mongoose.readyState === undefined) {
    mongoose.connect('mongodb://127.0.0.1:27017/cutbtn', function(err){
        if(!err){
            console.log('connected to mongoDB');
        }else{
            throw err;
        }
    });
}
var UserSchema = new Schema({
	name:         String,
	score:        Number,
	normalModel:  {
					level: Number,
					HP: Number
				},
	randomModel:  {
					level: Number,
					HP: Number,
					map:Array
				}
});
var userModel = mongoose.model('User', UserSchema);

function User(user){
	this.name = user.name;
	this.score = user.score;
	this.normalModel = user.normalModel;
	this.randomModel = user.randomModel;
}

User.prototype.save = function(cb){
	// console.log(this);
	var _user = {
		name: this.name,
		score: this.score || 0,
		normalModel: this.normalModel || {
			level:1,
			HP:3
		},
		randomModel: this.randomModel || {
			level: 1,
			HP: 3,
			map:[]
		}
	};
	var newUser = new userModel(_user);
	newUser.save(function(err, _user){
		if(err){
			return cb(err);
		}
		cb(null, _user);
	})
};

User.checkName = function(obj, cb){
		userModel.findOne({name:obj.name},function(err,user){
	        if(err){
	            return cb(err);
	        }
			if(user){
				console.log(user);
				cb(null, {
					name:user.name,
					islogined:true,
					score:user.score || 0,
					normalModel: user.normalModel || {
						level: 1,
						HP: 3
					},
					randomModel: user.randomModel || {
						level: 1,
						HP: 3,
						map: []
					}
				});// 返回json数据
			}else{
				cb(null, {
					islogined:false
				});// 返回未登录状态
			}
	    });
};
module.exports = User;