
const {MongoClient,ObjectID} = require('mongodb'); //identical to the top line



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) =>{
	if(err){
		return console.log("Unable to connect to MongoDB");
	}
	console.log("Connected to MongoDB");
 	
	//findOneAndUpdate
	db.collection('Users').findOneAndUpdate({
		_id:new ObjectID('5c50b42b002e7638b01d3995')
	},{$inc:{
		age:1
		},
		$set:{
			name: 'Testing Name'
		}
	},{
	returnOriginal:false
	})
	.then((result)=>{
		console.log(result);
	})
	//update operators
 	//db.close();	//no more db.close it is client.close() in v3
 }); //aws or heroku link 


