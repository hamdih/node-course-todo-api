const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');
//5c5601eab0ecbc3f2440f577 id of todo

// var id = '5c5601eab0ecbc3f2440f57711';
var id = '5c520cc5c15d6a2cb01780cf';
// if(!ObjectID.isValid(id)){
// 	console.log("Invalid Id");
// }


// Todo.find({
// 	_id:id
// }).then((todos)=>{
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo)=>{
// 	console.log('Todo', todo)
// });

// Todo.findById(id).then((one)=>{
// 	if(!one){
// 		return console.log('id not found');
// 	}
// 	console.log(one);
// }).catch((e) => console.log(e));

user.findById(id).then((one)=>{
	if(!one){
		return console.log('user not found');
	}
	console.log(one);
}).catch((e) => console.log(e));
