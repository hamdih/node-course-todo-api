const express = require('express');
const bodyParser = require('body-parser');

var{mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {user} = require('./models/user');


var app = express();

app.use(bodyParser.json());
//send json to our express application
app.post('/todos',(req,res) => {
	var todo = new Todo({
		text: req.body.text
	});
	todo.save().then((result) =>{
		
		res.status(200).send(result);
		},(e)=>{
		res.status(400).send(e);
		
	});
});



app.listen(3000, ()=>{
	console.log("Started on port 3000");
});


