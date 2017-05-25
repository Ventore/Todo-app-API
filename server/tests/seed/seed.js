const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
var { Todo } = require("./../../models/todo");
var { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "test1@test.com",
    password: 'password1',
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: 'auth'}, 'secret').toString() }]
}, 
{
    _id: userTwoId,
    email: "test2@test.com",
    password: 'password2',
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userTwoId, access: 'auth'}, 'secret').toString() }]
}];

const todos = [
    {   
        _id: new ObjectID(),
        text: "First test todo",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
   Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
   }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};