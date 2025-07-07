import type { Server as NetServer } from "http"
import type { NextApiResponse } from "next"
import type { Server as ServerIO } from "socket.io"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export interface ServerToClientEvents {
  message: (data: {
    id: string
    text: string
    user: string
    timestamp: Date
    room: string
  }) => void
  userJoined: (data: { user: string; room: string }) => void
  userLeft: (data: { user: string; room: string }) => void
  roomUsers: (users: string[]) => void
  error: (message: string) => void
}

export interface ClientToServerEvents {
  message: (data: { text: string; user: string; room: string }) => void
  joinRoom: (data: { user: string; room: string }) => void
  leaveRoom: (data: { user: string; room: string }) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  user: string
  room: string
}
