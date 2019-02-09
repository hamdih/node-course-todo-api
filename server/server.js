require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
//send json to our express application
app.post('/todos',authenticate,(req,res) => {
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	todo.save().then((todo) =>{
		
		res.status(200).send(todo);
		},(e)=>{
		res.status(400).send(e);	//helps with testing, what are we expecting?
		
	});
});

app.get('/todos', authenticate, (req,res) =>{	//get food trucks saved by user
	Todo.find({
		_creator: req.user._id
	}).then((todos)=>{

		res.send({todos});

	},(e) =>{	//if rejected
		res.status(400).send(e);
	})
});

app.get('/users/me', authenticate, (req,res)=>{
		res.send(req.user);
});

app.delete('/users/me/token',authenticate,(req,res)=>{

	req.user.removeToken(req.token).then(()=>{
		res.status(200).send();
	}, ()=>{
		res.status(400).send();
	})
});


app.post('/users',(req,res) =>{
	var body = _.pick(req.body,['email', 'password']);
	var user = new User(body);

	//model instance and instance method
	//newUser.generateAuthToken//User.findByToken


	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token) =>{
		res.header('x-auth',token).send(user); //x- means it is custom
	},(e)=>{
		res.status(400).send(e);
	});




});

app.delete('/todos/:id',authenticate,(req,res) =>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator:req.user._id
	}).then((todo) =>{
		if(!todo){
			return res.status(404).send();
		}
			res.send({todo});
	}).catch((e)=>{

		res.status(400).send(todo);
	});

});

//GET /todos/1234324 ---> dynamics whatever the user puts in

app.get('/todos/:id',authenticate,(req,res)=>{
	//res.send(req.params);
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		
		return res.status(404).send(console.log("Invalid Id:", id));
	}

	Todo.findOne({
		_id:id,
		_creator: req.user._id
	}).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) =>{
		res.status(400).send();
	})
});


app.patch('/todos/:id',authenticate,(req,res) =>{
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

	Todo.findOneAndUpdate({_id: id, _creator:req.user._id},{$set : body},{new: true}).then((todo)=>{
		if(!todo){
			return res.status(404).send();
		}
			res.send({todo});
	}).catch((e)=>{
		res.status(400).send();
	});

});

//POST /users/login {email,password}

	app.post('/users/login', (req,res) =>{
		var body = _.pick(req.body, ['email', 'password']);

		User.findByCredentials(body.email,body.password).then((user)=>{
			return user.generateAuthToken().then((token)=>{ //any errors will go to the catch(e)
			res.header('x-auth',token).send(user); //x- means it is custom
			});
			res.send(user);
		}).catch((e)=>{			//catch(e) will catch promises that are rejected
			res.status(400).send();
		})
	})	

app.listen(port, ()=>{
	console.log(`Started on port ${port}`);
});

module.exports = {app};
