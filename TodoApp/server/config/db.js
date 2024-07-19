const mongoose = require("mongoose")

const connectWithDb = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("Database successfully connected");
    })
    .catch(error=>{
        console.log("Database connection failed");
        console.log(error);
        process.exit(1)
    })
}

module.exports = connectWithDb