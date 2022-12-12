import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub!: Subscription;
    user: User | null = null;

    constructor(private authService: AuthService, public translateService: TranslateService) { }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.user = user;
            this.isAuthenticated = !!user;
        });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}