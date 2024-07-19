const express = require("express")
const app = express()
require('dotenv').config()
const cookieParser  = require("cookie-parser")
const cors = require("cors")

// regular middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())



/// Routes

const user = require('./route/user')
const todo = require("./route/todo")

// router middleware


app.use('/api/v1',user)
app.use('/api/v1',todo)





module.exports = app