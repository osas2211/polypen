// "use server"
import { socket } from "@/app/(in-app)/socket-demo/socket"

export const joinDocRoom = async ({ username = "", room = "" }) => {
  socket.emit("joinRoom", { user: username.trim(), room: room.trim() })
  socket.emit("userJoined", { user: username.trim(), room: room.trim() })
}
