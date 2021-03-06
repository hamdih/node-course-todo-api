const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
//need this to add methods
var UserSchema = new mongoose.Schema({
	email:{
		required: true,
		trim: true,
		type: String,
		minLength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},

	password:{
		type:String,
		required: true,
		minlength: 6
	},
	tokens:[{
		access:{
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}]


});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function() {
//this keyword
	var user = this;	//calling the document
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET).toString();

	user.tokens = user.tokens.concat({access, token});
	return user.save().then(() =>{
		return token;
	});ww
};

UserSchema.methods.removeToken = function(token) {
	var user = this;
	return user.update({
		$pull: {
			tokens: {token}
		}
	})

};
UserSchema.statics.findByToken = function(token) {	//model method is static
	var User = this; //calling the model
	var decoded;

	try{
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	}catch (e){
		return Promise.reject();
	}

	return User.findOne({
			'_id': decoded._id,
			'tokens.token': token,	//query the value of tokens array
			'tokens.access' : 'auth'
	});


};

UserSchema.pre('save',function (next) {
	var user = this;
	//will always run and re has , need to check
	
	if(!user.isModified('password')){
		next();
	}
	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(user.password,salt, (err,res) =>{
			if (err){
				//dont save
			}
			user.password = res;
			next();
		});
	 
	});
});

UserSchema.statics.findByCredentials = function(email,password){
	var user = this;
	
	return user.findOne({email}).then((user)=>{
		if(!user){
			return Promise.reject();				//promises are callbacks ig rejected will go catch(e)
		}
		return new Promise((resolve, reject)=>{	//can create own promise with resolve and reject
			bcrypt.compare(password,user.password, (err,res)=>{
					if(err){
					reject();
					}else if(!res){
					reject();
					}
					resolve(user);

			});
		});
	});

};



var User = mongoose.model('User',UserSchema);

module.exports = {User};