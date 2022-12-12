import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../loads/message.model';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    socket: any;

    constructor() { }

    setupSocketConnection() {
        const token = sessionStorage.getItem('token');

        if (!this.socket) {
            this.socket = io('http://localhost:8080', {
                auth: {
                    token
                }
            });
        }
    }

    joinChatRoom(loadId: string) {
        this.socket.emit('joinRoom', { room: loadId });
    }

    sendMessage(message: string, loadId: string, userId: string, role: string) {
        this.socket.emit('chatMessage', { message, room: loadId, userId, role });
    }

    onNewMessage() {
        return new Observable(observer => {
            this.socket.on('message', (message: Message) => {
                observer.next(message);
            });
        })
    }

    onLoadIteratedToNextState() {
        return new Observable(observer => {
            this.socket.on('loadIterateToNextState', (data: any) => {
                observer.next(data);
            });
        });
    }

    onAssignTruckToDriver() {
        return new Observable(observer => {
            this.socket.on('assignNewTruckToDriver', (data: any) => {
                observer.next(data);
            });
        });
    }
}
