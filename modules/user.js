var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
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
	level:        Number
});
var userModel = mongoose.model('User', UserSchema);

function User(user){
	this.name = user.name;
	this.score = user.score;
	this.level = user.level;
}

User.prototype.save = function(cb){
	// console.log(this);
	var _user = {
		name: this.user,
		score: this.score || 0,
		level: this.level || 0
	};
	console.log('ok');
	var newUser = new userModel(_user);
	newUser.save(function(err, _user){
		if(err){
			return cb(err);
		}
		cb(null, book);
	})
};

User.checkName = function(obj, cb){
	console.log('00');
	// userModel.findOne({name:obj.name},function(err, user){
	// 	if(err){
	// 		return cb(err);
	// 	}
	// 	cb(null, {islogined:true});
	// });

		userModel.find({name:obj.name},function(err,user){
	        if(err){
	            return cb(err);
	        }
	        cb(null, {islogined:true});//book数组
	    });
};
module.exports = User;