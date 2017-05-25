require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

const { ObjectId } = require("mongodb");
var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");
var { authenticate } = require("./middleware/authenticate");

var app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

//******
// TODOS
//******

// GET ALL
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
      res.send({ todos });
   }, (err) => {
      res.status(400).send(err);
   });
});
// ROOT
app.get("/", (req, res) => {
   res.send("Go to /todos");
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
// DELETE ONE
app.delete('/todos/:id', (req, res) => {
   let id = req.params.id;
   if(!ObjectId.isValid(id)) {
      return res.status(404).send();
   }
   Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo) {
         return res.status(404).send();
      }
      res.status(200).send({ todo });
   }).catch((err) => {
      res.status(400).send(err);
   });
});
//PATCH ONE
app.patch("/todos/:id", (req, res) => {
   var id = req.params.id;
   var body = _.pick(req.body, ['text', 'completed']);
   if(!ObjectId.isValid(id)) {
      return res.status(404).send();
   }
   if(_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
   } else {
      body.completed = false;
      body.completedAt = null;
   }
   Todo.findByIdAndUpdate(id, {
      $set: body   
   }, 
   {
      new: true   
   }).then((todo) => {
      if(!todo) {
         return res.status(404).send();
      }
      res.status(200).send({ todo });
   }).catch((err) => {
      res.status(400).send(err);
   });
});

//******
// USERS
//******
app.get("/users/me", authenticate,(req, res) => {
   
   res.send(req.user);
  
});

app.post('/users', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   
   var user = new User(body);
   
   user.save().then(() => {
      return user.generateAuthToken(); 
   }).then((token) => {
      res.header('x-auth', token).send(user);
   }).catch((e) => {
      res.status(400).send(e);
   });
});

app.post('/users/login', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   
   User.findByCredentials(body.email, body.password).then((user) => {
   
      return user.generateAuthToken().then((token) => {
         res.header('x-auth', token).send(user);      
      }); 
      
   }).catch((err) => {
      res.status(400).send(err);
   });

});

app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
      res.status(200).send();
   }, () => {
      res.status(400).send();
   });
});

app.listen(PORT, process.env.IP, () => {
   console.log("Server is running...");
});

module.exports = { app };