"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import type { ServerToClientEvents, ClientToServerEvents } from "@/lib/socket"

type SocketIOClient = Socket<ServerToClientEvents, ClientToServerEvents>

export const useSocket = () => {
  const [socket, setSocket] = useState<SocketIOClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    const socketInstance: SocketIOClient = io(
      process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    )

    socketInstance.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}
