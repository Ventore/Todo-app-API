const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    } 
    console.log('Connected to mongodb');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //   if(err) {
    //       return console.log('Unable to insert document', err);
    //   } 
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    
    // db.collection('Users').insertOne({
    //     name: 'Bohdan Basov',
    //     age: 23,
    //     location: 'Zhytomyr'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to create User!');
    //     } 
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    
    db.close();
});