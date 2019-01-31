var mongoose = require('mongoose');

var user = mongoose.model('users', { //"users" collection in DB from up town being connected to
	email:{
		required: true,
		trim: true,
		type: String,
		minLength: 1
	}

});

module.exports = {user};