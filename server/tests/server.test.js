const expect = require("expect");
const request =require("supertest");
const { ObjectID } = require('mongodb');

var { app } = require("./../server");
var { Todo } = require("./../models/todo");

const todos = [
    {   
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo"
    }
];

beforeEach((done) => {
   Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
   }).then(() => done());
});

describe('POST /todos', () => {
    
    it('should create a new todo', (done) => {
        var text = "Test todo text!";
        
        request(app)
                .post("/todos")
                .send({text})
                .expect(200)
                .expect((res) => {
                    expect(res.body.text).toBe(text);
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                    Todo.find({ text }).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((err) => done(err));
                });
    });
    
    it('should not create a new todo with invalid body data', (done) => {
       var text = "";
       
       request(app)
            .post("/todos")
            .send({text})
            .expect(400)
            .end((err, res) => {
               if(err) {
                   return done(err);
               }
               Todo.find().then((todos) => {
                   expect(todos.length).toBe(2);
                   done();
               }).catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    
    it('should get all todos', (done) => {
        request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(2); 
                })
                .end(done);
    });
    
});

describe('GET /todos/:id', () => {
   
   it("should return todo document", (done) => {
        request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe("First test todo");
                })
                .end(done);
   });
   
    it("should return 404 error if not found", (done) => {
        var fakeId = new ObjectID().toHexString();
        request(app)
                .get(`/todos/${fakeId}`)
                .expect(404)
                .end(done);
   });

    it("should return 404 error if not ObjectID", (done) => {

        request(app)
            .get(`/todos/123abc`)
            .expect(404)
            .end(done);
   });
    
});