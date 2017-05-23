const{SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = 'abc123';
var hashedPassword = '$2a$10$1DO0SJnT5IO.pSvvy4UmlOowSTB1kUGxywg243DEjtXsABIar64la';


bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);    
    });        
});

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);    
});

// jwt.sign
// jwt.verify