require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');
const {ObjectID} = require('mongodb');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
//send json to our express application
app.post('/todos',(req,res) => {
	var todo = new Todo({
		text: req.body.text
	});
	todo.save().then((result) =>{
		
		res.status(200).send(result);
		},(e)=>{
		res.status(400).send(e);	//helps with testing, what are we expecting?
		
	});
});

app.get('/todos', (req,res) =>{
	Todo.find().then((todos)=>{

		res.send({todos});

	},(e) =>{	//if rejected
		res.status(400).send(e);
	})
});

app.delete('/todos/:id',(req,res) =>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) =>{
		if(!todo){
			return res.status(404).send();
		}
			res.send({todo});
	}).catch((e)=>{

		res.status(400).send(todo);
	});

});

//GET /todos/1234324 ---> dynamics whatever the user puts in

app.get('/todos/:id',(req,res)=>{
	//res.send(req.params);
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		
		return res.status(404).send(console.log("Invalid Id:", id));
	}

	Todo.findById(id).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) =>{
		res.status(400).send();
	})
});


app.patch('/todos/:id',(req,res) =>{
	var id = req.params.id;
	var body = _.pick(req.body, ['text','completed']); 	//only thing users can actually update, subset of things
	if(!ObjectID.isValid(id)){
		
		return res.status(404).send();
	}
		//make sure what is being passed is true or false and if it is true
	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id,{$set : body},{new: true}).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
			res.send({todo});
	}).catch((e)=>{
		res.status(400).send();
	});

});

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});

module.exports = {app};
