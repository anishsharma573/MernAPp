const app  = require("./app")
const connectWithDb = require("./config/db")

connectWithDb()

app.listen(process.env.PORT ,()=>{
    console.log(`Server is Running at ${process.env.PORT}`);
})