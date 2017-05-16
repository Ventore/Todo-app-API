const { ObjectId } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");



// Todo.remove({}).then((result) => {
//     console.log(result); 
// });

// Todo.findOneAndRemove().then((doc) => {
//     console.log(doc);
// });

Todo.findByIdAndRemove('591afcbbddfef90936551385').then((res) => {
    console.log(res);
});