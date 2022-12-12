import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    driverMode = true;
    private userSub!: Subscription;
    user: User | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.autoLogin();

        this.userSub = this.authService.user.subscribe(user => {
            this.user = user;

            if (this.user) {
                this.driverMode = this.user.role === 'DRIVER' ? true : false;
            }
        })
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
