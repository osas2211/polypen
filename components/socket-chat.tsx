"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Users, Wifi, WifiOff, MessageSquare } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { toast } from "sonner"
import { joinDocRoom } from "@/utils/joinDocRoom"

import { io } from "socket.io-client"

export const socket = io({ transports: ["websocket", "polling"] })

interface Message {
  id: string
  text: string
  user: string
  timestamp: Date
  room: string
}

export default function SocketChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [currentRoom, setCurrentRoom] = useState("")
  const [roomUsers, setRoomUsers] = useState<string[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true)
      // setTransport(socket.io.engine.transport.name)

      socket.io.engine.on("upgrade", (transport) => {
        // setTransport(transport.name)
      })
    }

    function onDisconnect() {
      setIsConnected(false)
      // setTransport("N/A")
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    // Listen for messages
    socket.on("message", (message) => {
      console.log(message)
      setMessages((prev) => [...prev, message])
    })

    // Listen for user events
    socket.on("userJoined", ({ user, room }) => {
      setRoomUsers([...roomUsers, user])
      toast.success("User Joined", {
        description: `${user} joined ${room}`,
      })
    })

    socket.on("userLeft", ({ user, room }) => {
      toast.success("User Left", {
        description: `${user} left ${room}`,
      })
    })

    // Listen for room users updates
    socket.on("roomUsers", (users) => {
      console.log(users)
      // setRoomUsers([...roomUsers, users])
    })

    socket.on("error", (message) => {
      toast.error("Error", {
        description: message,
      })
    })

    return () => {
      socket.off("message")
      socket.off("userJoined")
      socket.off("userLeft")
      socket.off("roomUsers")
      socket.off("error")
    }
  }, [socket, toast])

  const joinRoom = async () => {
    if (!socket || !username.trim() || !room.trim()) {
      toast.error("Error", {
        description: "Please enter both username and room name",
      })
      return
    }
    console.log(socket.id)

    socket.emit("joinRoom", { user: username.trim(), room: room.trim() })

    setCurrentRoom(room.trim())
    setIsJoined(true)
    // setMessages([]) // Clear previous messages

    toast.success("Joined Room", {
      description: `Welcome to ${room.trim()}!`,
    })
  }

  const leaveRoom = () => {
    if (!socket || !currentRoom) return

    socket.emit("leaveRoom", { user: username, room: currentRoom })
    setIsJoined(false)
    setCurrentRoom("")
    setMessages([])
    // setRoomUsers([])

    toast.success("Left Room", {
      description: `You left ${currentRoom}`,
    })
  }

  const sendMessage = () => {
    if (!socket || !newMessage.trim() || !isJoined) return

    socket.emit("message", {
      text: newMessage.trim(),
      user: username,
      room: currentRoom,
    })

    setMessages((prev) => [
      {
        text: newMessage.trim(),
        user: username,
        room: currentRoom,
        id: Math.random() as any,
        timestamp: new Date(),
      },
      ...prev,
    ])

    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Join Chat Room
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className={isConnected ? "bg-green-100 text-green-700" : ""}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Room Name</label>
                <Input
                  placeholder="Enter room name"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                />
              </div>

              <Button
                onClick={joinRoom}
                className="w-full"
                disabled={!isConnected}
              >
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Room: {currentRoom}</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {username}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={isConnected ? "bg-green-100 text-green-700" : ""}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button variant="outline" onClick={leaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium">{message.user}</span>
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg max-w-xs ${
                          message.user === username
                            ? "bg-blue-500 text-white ml-auto"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  disabled={!isConnected}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Online Users ({roomUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {roomUsers.map((user) => (
                    <div
                      key={user}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {user.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user}</span>
                      {user === username && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
