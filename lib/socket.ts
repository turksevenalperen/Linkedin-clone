// lib/socket.ts
import { io } from "socket.io-client"

const socket = io({
  path: "/api/socket/io", // server.ts içindeki path ile eşleşmeli
})

export default socket
