const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




var password = '123abc!';

//salting is very important, adds a value to set password

// bcrypt.genSalt(10,(err,salt) =>{
// 	bcrypt.hash(password,salt,(err,hash)=>{
// 		if(err){
// 			return console.log(err);
// 		}
// 		console.log(hash);
// 	})
// });		//used to combat bruteforce


var hashedPassword = '$2a$10$4USOrJjYhPRvxqNB7VRIEeIT8xwZz4uguqcsA0hu.PmPOgfRZjSI.';

bcrypt.compare(password,hashedPassword, (err,res) =>{
	if(err){
		return console.log(err);
	}
	console.log(res);
})
//for playground purposes

// var data = {
// 	id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log(token);


// var decoded = jwt.verify(token,'abc123');

// console.log('decoded:',decoded);

// // var message = 'I am user number 3';
// // var hash = SHA256(message).toString();

// // console.log(`Message: ${message}, hash: ${hash}`);




// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data).toString());

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
// 	console.log('Not manipluated');
// }else{
// 	console.log('data has been changed');
// }

// //JSON web token