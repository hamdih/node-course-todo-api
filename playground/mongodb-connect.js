//look for mongo client to connect to server and issue 
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb'); //identical to the top line


var obj = new ObjectID();
console.log(obj);

// var user = {name:'andrew',age:25};

// var{name} = user;	//destructure user object to take out a variable
// console.log(name);

//db is changed to client in v3
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) =>{
	if(err){
		return console.log("Unable to connect to MongoDB");
	}
	console.log("Connected to MongoDB");

	//need reference const db = client.db('TodoApp');

	// db.collection('TodoApp').insertOne({
	// 	text:'Something to do',
	// 	completed: false
	// }, (err,result) =>{
	// 	if(err){
	// 		return console.log("Unable to insert todo",err);
	// 	}
	// 	console.log(JSON.stringify(result.ops,undefined,2));
	// })

//insert new doc into Users (name,age,location)
// 	db.collection('Users').insertOne({
// 		name:'hamdi hmimy',
// 		age: 23,
// 		location: "Austin"
// 	}, (err,result) =>{
// 		if(err)
// 		{
// 			console.log("Unable to insert into user",err);
// 		}
// 		console.log(result.ops[0]._id.getTimestamp());
// 	})
	
 	db.close();	//no more db.close it is client.close() in v3
 }); //aws or heroku link 