
const {MongoClient,ObjectID} = require('mongodb'); //identical to the top line



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) =>{
	if(err){
		return console.log("Unable to connect to MongoDB");
	}
	console.log("Connected to MongoDB");
 	
	db.collection('Users').find({name: 'hamdi hmimy'}).toArray().then((docs) =>{
		console.log('Users');
		console.log(JSON.stringify(docs,undefined,2));
	}, (err) =>{
		console.log("unable to fetch todos",err);
	});

// db.collection('Todos').find().count().then((count) =>{
// 		console.log(`Todos count: ${count}`);
		
// 	}, (err) =>{
// 		console.log("unable to fetch todos",err);
// 	});

 	//db.close();	//no more db.close it is client.close() in v3
 }); //aws or heroku link 


//_id:new ObjectID('5c50b393b84a5f30a4612621')