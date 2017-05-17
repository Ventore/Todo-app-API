var env = process.env.NODE_ENV || 'development';
console.log("Enviroment: ", env);

if(env === 'development') {
   process.env.PORT = process.env.PORT || 3000;
   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
   console.log("DB: ", process.env.MONGODB_URI);
} else if(env === 'test') {
   process.env.PORT = process.env.PORT || 3000;
   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
   console.log("DB: ", process.env.MONGODB_URI);
}