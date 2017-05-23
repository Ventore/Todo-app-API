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
    password: 'password2'
}];

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