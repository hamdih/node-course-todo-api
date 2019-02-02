const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text:"First test"
	},{
	text:"second test",
	_id	: new ObjectID()
}];

beforeEach((done) =>{
	Todo.remove({}).then(()=>{

		Todo.insertMany(todos);
	}).then(()=>done());
	 //wipe all todos
	
});				//run code before every test case

describe('POST /todos', () =>{
	it('should create a new todo', (done) =>{
		var text = 'testing todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)		//expect status
			.expect((res)=> {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) =>{
					if(err){
						return done(err);
					}

					Todo.find({text}).then((todos) => {
						expect(todos.length).toBe(1);
						expect(todos[0].text).toBe(text);
						done();
					}).catch((e)=> done(e));
			});
});
		it('should not create a todo with invalid body data', (done) =>{

				request(app)
					.post('/todos')
					.send({})
					.expect(400)
					.end((err,res) =>{
						if(err){
							return done(err);
						}
						Todo.find().then((todos) =>{
							expect(todos.length).toBe(2);
							done();
						}).catch((e) => done(e));

					})
			});
	
});

describe('Get /todos', () =>{
	it('should get all todos', (done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) =>{
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	})
});

describe('GET /todos/:id',() =>{
	it('should get todo based on id', (done)=>{
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) =>{
				expect(res.body.todo.text).toBe(todos[0].text);
				//console.log(res.body.todo[0].text);
			})
			.end(done);

	});

	it('should return a 404 if todo not found hexid',(done)=>{
		var hexId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${hexId}`)
			.expect(404)
			.end(done);

	});
	it('should return a 404 if todo not found 123',(done)=>{
		request(app)
			.get(`/todos/1234`)
			.expect(404)
			.end(done);

	});
});