const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text:"First test",
	completed: false,
	completedAt: null
	},{
	text:"second test",
	_id	: new ObjectID(),
	completed: true,
	completedAt: null
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

describe('DELETE /todos/:id', () =>{
	it('should delete a todo', (done)=>{
		var hexId = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) =>{
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err,res)=>{
				if(err){
					return done(err);
				}
				Todo.findById(hexId).then((result) =>{
					expect(result).toNotExist();
					done();
				})
			})

	});

	it('should return 404 if todo not found', (done)=>{
		var id = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done)
	});

	it('should return 404 if object id invalid', (done)=>{
		request(app)
			.delete('/todos/1234')
			.expect(404)
			.end(done)
	});

});

describe('PATCH /todos/:id', () =>{
	it('should update a todo', (done)=>{
		var hexId = todos[0]._id.toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.send({text:"testing the change"})
			.expect(200)
			.expect((res) =>{
				expect(res.body.todo.text).toBe("testing the change");
			})
			.end(done)

	});

	it('should return 404 if todo not found', (done)=>{
		var id = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done)
	});

	it('should change completedAt if completed is true', (done)=>{
		var hexId = todos[0]._id.toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.send({completed: true})
			.expect(200)
			.expect((res) =>{
				expect(res.body.todo.completedAt).toExist();
			})
			.end(done)
	});

it('should not update any field expect text and completed', (done)=>{
		var hexId = todos[0]._id.toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.send({completedAt: true, _id:0,__v:2 })
			.expect(200)
			.expect((res) =>{
				expect(res.body.todo.completedAt).toNotExist();
				expect(res.body.todo._id).toNotBe(0);
				expect(res.body.todo.__v).toNotBe(2);
			})
			.end(done)
	});
});