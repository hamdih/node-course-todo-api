const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');


Todo.findOneAndRemove({}).then((result)=>{
	console.log(result);
});


// Todo.findOneAndRemove({}).then((result)=>{
// 	console.log(result);
// });

// Todo.findByIdAndRemove({})