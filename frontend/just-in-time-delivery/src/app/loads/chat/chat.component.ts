import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { WebsocketService } from 'src/app/shared/websocket.service';
import { LoadWithDriverAndMessages } from '../load.model';
import { LoadsService } from '../loads.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    chatForm!: FormGroup;
    errorMessage!: string;
    loadId!: string;
    load!: LoadWithDriverAndMessages;
    loadLoading = false;
    userSub!: Subscription;
    user!: User;

    constructor(private authService: AuthService, 
        private websocketService: WebsocketService, 
        private loadsService: LoadsService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.authService.autoLogin();

        this.route.params
            .subscribe(
                (params: Params) => {
                    this.loadId = params['loadId'];

                    this.loadLoading = true;
                    this.loadsService.getLoadDetailedInfo(this.loadId).subscribe({
                        next: (load) => {
                            this.loadLoading = false;
                            this.load = load;
                        }
                    });

                    this.userSub = this.authService.user.subscribe(user => {
                        this.user = user!!;
                        this.chatForm = new FormGroup({
                            'text': new FormControl(null, [Validators.required])
                        })
                
                        this.websocketService.setupSocketConnection();

                        this.websocketService.joinChatRoom(this.loadId);
                
                        this.websocketService.onNewMessage().subscribe({
                            next: (message) => {
                                this.messageReceived(message);
                            }
                        });
                    })
                }
            );
    }

    onSubmit() {
        this.websocketService.sendMessage(this.chatForm.get('text')!!.value, this.loadId, this.user._id, this.user.role);
        this.chatForm.reset();
    }

    messageReceived(message: any) {
        if (this.load && this.load.messages) {
            this.load.messages.push(message);
        }
    }

    transformDate(date: string): Date {
        return new Date(date);
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
