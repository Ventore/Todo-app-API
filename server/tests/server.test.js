const expect = require("expect");
const request =require("supertest");
const { ObjectID } = require('mongodb');

var { app } = require("./../server");
var { Todo } = require("./../models/todo");
var { User } = require("./../models/user");
const { todos, users, populateTodos, populateUsers } = require("./seed/seed");


beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('DELETE /todos/:id', () => {
    it("should delete a todo", (done) => {
    var hexId = todos[0]._id.toHexString();
        request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
                });
    }); 
    it("should return 404 error if not found", (done) => {
        var fakeId = new ObjectID().toHexString();
        request(app)
                .delete(`/todos/${fakeId}`)
                .expect(404)
                .end(done);
    });
    it("should return 404 error if not ObjectID", (done) => {
        request(app)
            .delete(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
}); 
describe('PATCH /todos/:id', () => {
    it("should update the todo", (done) => {
        var hexId = todos[0]._id.toHexString();
        
        request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    completed: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                    Todo.findById(hexId).then((todo) => {
                        expect(todo.completed).toBe(true);
                        done();
                    }).catch((err) => done(err));
                });
    });
    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    text: "Updated text"
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe("Updated text");
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
                
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
    });
});
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'test@exapmle.com';
        var password = 'password';
        
        request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    
                    User.findOne({email}).then((user) => {
                        expect(user._id).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    });
                });
    });    
    it('should not create a user with invalid email', (done) => {
        let email = 'test.test';
        let password = 'pass';
        
        request(app)
                .post('/users')
                .send(email, password)
                .expect(400)
                .expect((res) => {
                    expect(res.body.errors.email.message).toBe('Path `email` is required.');    
                })
                .end(done);
    });
    it('should not create user with taken email', (done) => {
        let email = 'test1@test.com';
        let password = 'password';
        
        request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .expect((res) => {
                    expect(res.body.code).toBe(11000);
                })
                .end(done);
    });
});
describe('POST /users/login', () => {
    it('should log in user and return auth token', (done) => {
        request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toBe(users[1]._id.toHexString());
                })
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
                
                    User.findById(users[1]._id).then((user) => {
                        expect(user.tokens[0]).toInclude({
                            access: "auth",
                            token: res.headers['x-auth']
                        });
                    }).catch((err) => {
                        if (err) {
                            return done(err);
                        }
                    });
                    done();
                });
    });
    it('should reject invalid login', (done) => {
        request(app)
                .post('/users/login')
                .send({
                    email: 'asdasdas@sadad.asd',
                    password: 'asdasds'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers['x-auth']).toNotExist();
                })
                .end(done);
    });
});