// server.ts
import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { Server as SocketIOServer } from "socket.io"
import { Socket } from "socket.io"
import type { IncomingMessage, ServerResponse } from "http"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new SocketIOServer(server, {
    path: "/api/socket/io",
    addTrailingSlash: false,
  })

  io.on("connection", (socket: Socket) => {
    console.log(`📡 Socket.io bağlantısı: ${socket.id}`)

    socket.on("join", (userId: string) => {
      socket.join(userId)
      console.log(`👥 Kullanıcı ${userId} odasına katıldı`)
    })

    socket.on("new_message", (message) => {
      io.to(message.receiverId).emit("receive_message", message)
    })

    socket.on("disconnect", () => {
      console.log(`❌ Kullanıcı ayrıldı: ${socket.id}`)
    })
  })

  const PORT = parseInt(process.env.PORT || "3000", 10)
  server.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`)
  })
})
