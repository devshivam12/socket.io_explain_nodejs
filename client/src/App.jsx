import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

import {Container, Box,Stack ,  Typography, Button, TextField} from '@mui/material'

function App() {

  const socket = useMemo(() => io("http://localhost:8000/"), [])

  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [roomName, setRoomName] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) =>{
    e.preventDefault()
    socket.emit("message", {message, room})
    setMessage("")
  }

  const joiRoomHandler = (e) =>{
    e.preventDefault()
    socket.emit("join-room", roomName);
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id)
      setSocketId(socket.id)
    })
    socket.on("welcome", (s) => {
      console.log(s)
    })
    socket.on("recieved-message", (data)=>{
      console.log(data)
      setMessages((messages)=>[...messages, data])
    })
  }, [])
  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component='div' gutterBottom>
        Welcome to socket.io
      </Typography>

      <Typography variant='p' component='div' gutterBottom>
        Your id : {socketId}
      </Typography>

<form onSubmit={joiRoomHandler}>
<TextField
        type="text"
        value={roomName}
        onChange={(e)=> setRoomName(e.target.value)}
        label='room-name'
         />
         <Button type='submit'>Join</Button>
</form>
      <form onSubmit={handleSubmit}>
      <TextField
        type="text"
        value={room}
        onChange={(e)=> setRoom(e.target.value)}
        label='room'
         />
        <TextField
        type="text"
        value={message}
        onChange={(e)=> setMessage(e.target.value)}
         />
         <Button type='submit'>Send</Button>
      </form>

    <Stack>
      {
        messages.map((m, i)=>(
          <Typography key={i} variant='p'>
            {m}
          </Typography>
        ))
      }
    </Stack>

    </Container>
  )
}

export default App
