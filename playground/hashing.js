const{SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
    id: 5
};

var token = jwt.sign(data, 'supersecretstring');
console.log(token);
// jwt.sign
// jwt.verify