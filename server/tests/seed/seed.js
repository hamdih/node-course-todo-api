const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {app} = require('./../../server');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: "hamdi@example.com",
	password :'useronepass',
	tokens: [{
		access :'auth',
		token: jwt.sign({_id:userOneId,access: 'auth'}, 'abc123').toString()
	}]
	},
	{
	_id: userTwoId,
	email: 'hamdi2@example.com',
	password: 'usertwopass',
		tokens: [{
		access :'auth',
		token: jwt.sign({_id:userTwoId,access: 'auth'}, 'abc123').toString()
	}]
	}];

const todos = [{
	_id: new ObjectID(),
	text:"First test",
	completed: false,
	completedAt: null,
	_creator: userOneId
	},{
	text:"second test",
	_id	: new ObjectID(),
	completed: true,
	completedAt: null,
	_creator: userTwoId
}];

const populateTodos = (done) =>{
	Todo.remove({}).then(()=>{

		Todo.insertMany(todos);
	}).then(() => done());
	 //wipe all todos
	
};

const populateUsers = (done) =>{
	User.remove({}).then(()=>{
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne,userTwo])
	}).then(() => done());

};
module.exports = {todos, populateTodos, users,populateUsers};