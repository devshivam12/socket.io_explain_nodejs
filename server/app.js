import express from "express"
import { Server } from "socket.io"
import { createServer } from 'http'
import cors from 'cors'

const app = express()

const port = 8000

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: " http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

app.use(cors({
    origin: " http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}))

app.get('/', (req, res) => {
    res.send("Hello there")
})

io.on("connection", (socket) => {
    console.log("User connected", socket.id)
    console.log("user id", socket.id)
    // socket.broadcast.emit("welcome", `welcome to the server ${socket.id}`)

    socket.on("message", ({room, message})=>{
        console.log(room, message)
        socket.to(room).emit("recieved-message", message)
    })

    socket.on('join-room', (room)=>{
        socket.join(room)
        console.log(`User join room ${room}`)
    })

})
server.listen(port, () => {
    console.log(`Server is running at ${port} port`)
})