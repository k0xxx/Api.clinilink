var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var userAuthSchema = mongoose.Schema({
	url: {type: String, default: ''},
	local: {
		email: String,
		password: String,
		verification_token: String,
		verified: Boolean,
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	odnoklassniki: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	vk: {
		id: String,
		token: String,
		email: String,
		username: String,
		name: String
	},
	
	isBlocked: {Boolean, default: false},
	isBlockedTime: {type: Date, default: ''},
	regDate: { type: Date, default: Date.now }
});

userAuthSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userAuthSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('main_auth_users', userAuthSchema);