import { Server } from "socket.io";
import http from "http";
import { app } from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }
});

const onlineUser = {} // userId: socketId

export const getReceiverSocketId = (receiverIds) => {
    return receiverIds.map(id => onlineUser[id]);
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) onlineUser[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(onlineUser));

    socket.on("disconnect", () => {
        delete onlineUser[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUser));
    })
});

export { server, io };