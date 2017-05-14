var express = require("express");
var bodyParser = require("body-parser");

var { ObjectId } = require("mongodb");
var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");

var app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// GET ALL
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
      res.send({ todos });
   }, (err) => {
      res.status(400).send(err);
   });
});
// POST NEW
app.post('/todos', (req, res) => {
   var newTodo = new Todo({
      text: req.body.text
   });
   
   newTodo.save().then((doc) => {
      res.send(doc);
   }, (err) => {
      res.status(400).send(err);
   });
});
// GET ONE
app.get('/todos/:id', (req, res) => {
   var id = req.params.id;
   
   if(!ObjectId.isValid(id)) {
      return res.status(404).send();
   }
   
   Todo.findById(id).then((todo) => {
      if(!todo) {
         return res.status(404).send();   
      }
      res.status(200).send({ todo });
   }).catch((err) => {
      res.status(400).send(err);
   });
   
});

app.listen(PORT, process.env.IP, () => {
   console.log("Server is running...");
});

module.exports = { app };