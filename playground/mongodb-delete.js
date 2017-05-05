const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    } 
    console.log('Connected to mongodb');
    
    // db.collection("Todos").deleteMany({text: "Something to do"}).then((res) => {
    //     console.log(res.result);
    // }, (err) => {
    //     console.log(err);
    // });
    
    // db.collection("Todos").deleteOne({text: "Something"}).then((res) => {
    //     console.log(res);
    // }, (err) => {
    //     console.log(err);
    // });
    
    // db.collection("Todos").findOneAndDelete({completed: true}).then((res) => {
    //     console.log(res);
    // }, (err) => {
    //     console.log(err);
    // });
    
    db.collection("Users").deleteMany({name: "Bohdan Basov"}).then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err); 
    });
    
    db.close();
});