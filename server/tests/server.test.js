const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todo = [{
	text: "First test"
	},{
	text: "second test"	
}];

beforeEach((done) =>{
	Todo.remove({}).then(()=>{

		Todo.insertMany(todo);
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
})