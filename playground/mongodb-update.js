const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    } 
    console.log('Connected to mongodb');
    
    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID("5909bc72c570d00c68aa1a0d")
        
    }, {
        $set: {
            text: "adasdasdasdasdsad"
        } 
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });
    
    db.close();
});