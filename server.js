const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const http = require("http")
const path = require("path")

dotenv.config()

// routes
const authRouter = require("./src/router/authRouter")
const userRouter = require("./src/router/userRouter")
const chatRouter = require("./src/router/chatRouter")
const messageRouter = require("./src/router/messageRouter")


const app = express()
const PORT = process.env.PORT || 4001;

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    // origin: "netlify.app",
    origin: "*",
    // origin: "http://localhost:3000",
    // methods: ["GET", "POST"]
  }
})

// to save filess for public
app.use(express.static(path.join(__dirname, "src", "public")))

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(cors())

// routes use
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)


// websocket functions

let activeUsers = []

io.on('connection', (socket) => {
  // console.log("Client App ga kirdi");
  socket.on('new-user-add', (newUserId) => {
    if(!activeUsers.some(user => user.userId === newUserId)) {
      activeUsers.push({userId: newUserId, socketId: socket.id})
    }

    io.emit('get-users', activeUsers)
  })

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
    
    io.emit('get-users', activeUsers)
  })

  socket.on('exit', (id) => {
    activeUsers = activeUsers.filter(user => user.userId !== id)
    io.emit('get-users', activeUsers)
  })

  socket.on("send-message", (data) => {
    const {receivedId} = data
    const user = activeUsers.find(user => user.userId === receivedId)
    if(user) {
      io.to(user.socketId).emit('answer-message', data)
    }
  })
})

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {})
.then(()=> {
  server.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
})
.catch(error => console.log(error))

