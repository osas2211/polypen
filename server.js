import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer)

  io.on("connection", (socket) => {
    let roomId = ""
    socket.on("joinRoom", (data) => {
      socket.join(data.room)
      roomId = data.room
      socket.to(data.room).emit("userJoined", data)
    })

    socket.on("edit_doc", (data) => {
      socket.join(data.doc_id)
      socket.broadcast.to(data.doc_id).emit("edit_doc", data.text)
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
