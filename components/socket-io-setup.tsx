"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Server, Users, Send, Code, AlertTriangle } from "lucide-react"

export default function SocketIOSetup() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; user: string; timestamp: Date }>
  >([])
  const [newMessage, setNewMessage] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    setUsername(`User_${Math.random().toString(36).substring(2, 6)}`)
  }, [])

  // Simulated Socket.IO connection
  const connectToServer = () => {
    // This would be your actual Socket.IO connection
    // const socket = io('http://localhost:3001')

    setTimeout(() => {
      setIsConnected(true)
      addMessage("System", "Connected to server")
    }, 1000)
  }

  const addMessage = (user: string, text: string) => {
    const message = {
      id: Date.now().toString(),
      text,
      user,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    // This would emit to Socket.IO server
    // socket.emit('message', { text: newMessage, user: username })

    addMessage(username, newMessage)
    setNewMessage("")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Socket.IO Client Setup
        </h1>
        <p className="text-slate-600">
          Real-time communication with server mediation
        </p>
      </div>

      {/* Warning Card */}
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium text-orange-900">Server Required</h3>
              <p className="text-sm text-orange-700">
                Socket.IO requires a server to facilitate client-to-client
                communication. You cannot have direct client-to-client
                communication without a server acting as a mediator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Client Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection Status</span>
                <Badge
                  variant={isConnected ? "default" : "secondary"}
                  className={isConnected ? "bg-green-100 text-green-700" : ""}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              {!isConnected ? (
                <Button onClick={connectToServer} className="w-full">
                  Connect to Server
                </Button>
              ) : (
                <div className="space-y-3">
                  <ScrollArea className="h-48 w-full border rounded-lg p-3">
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <div key={message.id} className="text-sm">
                          <span className="font-medium text-slate-600">
                            {message.user}:
                          </span>
                          <span className="ml-2">{message.text}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Server Code Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Required Server Code
            </CardTitle>
          </CardHeader>
          {/* <CardContent>
            <div className="space-y-3">
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono">
                <div className="text-green-400">// server.js</div>
                <div className="text-blue-400">const</div> io = <div className="text-blue-400">require</div>(
                <div className="text-yellow-400">'socket.io'</div>)(<div className="text-purple-400">3001</div>);
                <br />
                <div className="text-slate-400">// Handle client connections</div>
                io.on(<div className="text-yellow-400">'connection'</div>, (socket) => {"{"}
                <div className="ml-4">
                  console.log(<div className="text-yellow-400">'Client connected'</div>);
                  <br />
                  <div className="text-slate-400">// Relay messages between clients</div>
                  socket.on(<div className="text-yellow-400">'message'</div>, (data) => {"{"}
                  <div className="ml-4">
                    socket.broadcast.emit(<div className="text-yellow-400">'message'</div>, data);
                  </div>
                  {"}"});
                </div>
                {"}"});
              </div>

              <Separator />

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono">
                <div className="text-green-400">// client.js</div>
                <div className="text-blue-400">import</div> io <div className="text-blue-400">from</div>{" "}
                <div className="text-yellow-400">'socket.io-client'</div>;
                <br />
                <div className="text-blue-400">const</div> socket = <div className="text-blue-400">io</div>(
                <div className="text-yellow-400">'http://localhost:3001'</div>);
                <br />
                <div className="text-slate-400">// Listen for messages</div>
                socket.on(<div className="text-yellow-400">'message'</div>, (data) => {"{"}
                <div className="ml-4">
                  console.log(<div className="text-yellow-400">'Received:'</div>, data);
                </div>
                {"}"});
              </div>
            </div>
          </CardContent> */}
        </Card>
      </div>

      {/* Installation Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Installation & Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Client Installation</h4>
              <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                npm install socket.io-client
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Server Installation</h4>
              <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                npm install socket.io
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Basic Usage</h4>
            <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm space-y-1">
              <div>1. Start your Socket.IO server</div>
              <div>2. Connect clients to the server</div>
              <div>3. Server relays messages between clients</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
