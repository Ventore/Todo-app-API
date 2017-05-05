const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    } 
    console.log('Connected to mongodb');
    
    // db.collection('Todos').find({_id: ObjectID('5909bc72c570d00c68aa1a0d')}).toArray().then((docs) => {
    //     console.log(docs);
    // }, (err) => {
    //     console.log('Unable to fetch docs',err);
    // });
    
    //     db.collection('Todos').find().count().then((count) => {
    //     console.log(count);
    // }, (err) => {
    //     console.log('Unable to fetch docs',err);
    // });
    
    db.collection('Users').find({name: 'Bohdan Basov'}).toArray().then((docs) => {
        console.log(docs);
    }, (err) => {
        console.log(err);
    });
    
    db.close();
});