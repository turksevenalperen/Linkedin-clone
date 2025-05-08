//types/next.ts
import type { NextApiResponse } from "next"
import type { Server as NetServer } from "http"
import type { Socket } from "net"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: any
    }
  }
}
