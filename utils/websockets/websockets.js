import { Server } from "socket.io";
import loadsService from "../../services/loads-service.js";

export default (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200'
        }
    });
    
    const socket = io.on('connection', (socket) => {
    
        socket.on('joinRoom', ({ room }) => {
            
            socket.join(room);
        });
    
        socket.on('chatMessage', ({ message, room, userId, role }) => {

            const createdDate = new Date().toISOString();

            loadsService().addMessageToTheLoad(message, room, userId, role, createdDate).then(() => {
                io.to(room).emit('message', {
                    author: userId, 
                    role,
                    text: message,
                    created_date: createdDate
                });
            });
            
        });

        return socket;
    });

    return {
        io,
        socket
    }
}

