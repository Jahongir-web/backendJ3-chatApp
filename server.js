const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const path = require("path")

dotenv.config()

// routes
const authRouter = require("./src/router/authRouter")


const app = express()
const PORT = process.env.PORT || 4001;

// to save filess for public
app.use(express.static(path.join(__dirname, "src", "public")))

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({useTempFiles: true}))
app.use(cors())

// routes use
app.use('/api/auth', authRouter)

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {})
.then(()=> {
  app.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
})
.catch(error => console.log(error))

