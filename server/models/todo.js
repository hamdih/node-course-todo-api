var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
		text:{
			type: String,
			required: true,		//validators
			minlength: 1,
			trim: true,

		},
		completed:{
			type: Boolean,
			default: false

		},
		completedAt:{
			type: Number,
			default: null
		},
		_creator:{	//setup associations
			required: true,
			type: mongoose.Schema.Types.ObjectId
		}
});

module.exports = {Todo};
//save new something-- dont have to micro manage how things are done


// var firstTodo = new Todo({ 

// 		text:"My first note", 
// 		completed: false,
// 		completedAt: new Date().getTime()
// 	});
// firstTodo.save().then((result)=>{
// 		console.log(result);
// 	}, (e) =>{
// 		console.log('unable to save');
	
// })

// var otherTodo = new Todo({});

// otherTodo.save().then((doc) =>{
// 	console.log(doc);
// });
