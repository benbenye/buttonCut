var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

console.log(mongoose);

var UserSchema = new Schema({
	name:         String,
	score:        Number,
	level:        Number
});
var User = mongoose.model('User', UserSchema);

function User(user){
	this.name = user.name;
	this.score = user.score;
	this.level = user.level;
}

User.prototype.save = function(cb){
	var _user = {
		name: this.user,
		score: this.score || 0,
		level: this.level || 0
	};
	var newUser = new userModel(_user);
	newUser.save(function(err, _user){
		if(err){
			return cb(err);
		}
		cb(null, book);
	})
};