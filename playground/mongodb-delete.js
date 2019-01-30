
const {MongoClient,ObjectID} = require('mongodb'); //identical to the top line



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) =>{
	if(err){
		return console.log("Unable to connect to MongoDB");
	}
	console.log("Connected to MongoDB");
 	
	//deleteMany
	// db.collection('Todos').deleteMany({text:'eat lunch'}).then((result) =>{
	// 	console.log(result);
	// });
	//deleteOne
	// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) =>{
	// 	console.log(result);
	// })
	//findOneAndDelete -- ** very useful
	db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
		console.log(result);
	});
 	//db.close();	//no more db.close it is client.close() in v3
 }); //aws or heroku link 


