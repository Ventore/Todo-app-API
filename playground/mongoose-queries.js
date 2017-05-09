const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");

var id = '5911b47ed650b408b6987bfd';

if(!ObjectId.isValid(id)) {
    console.log('ID is not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
   console.log('Todos', todos); 
});

Todo.findOne({
    _id: id
}).then((todo) => {
    if(!todo) {
        return console.log("Not found");
    }
   console.log('Todo', todo); 
});

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log("Id not found");
    }
   console.log('Todo by Id', todo); 
}).catch((err) => {
    console.log(err);
});