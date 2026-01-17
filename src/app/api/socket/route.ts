import { Server } from "socket.io"

const SocketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log("Socket is already running")
    } else {
        console.log("Socket is initializing")
        const io = new Server(res.socket.server)
        res.socket.server.io = io

        io.on("connection", (socket) => {
            socket.on("join-room", (userId) => {
                socket.join(userId)
                console.log(`User ${userId} joined`)
            })

            socket.on("send-message", (data) => {
                const { receiverId, senderId, content } = data
                io.to(receiverId).emit("receive-message", {
                    senderId,
                    content,
                    createdAt: new Date(),
                })
            })
        })
    }
    res.end()
}

export default SocketHandler
