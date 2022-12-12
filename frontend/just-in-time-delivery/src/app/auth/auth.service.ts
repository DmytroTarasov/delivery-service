import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, throwError, tap, take, exhaustMap, map } from 'rxjs';
import { GetUserProfileResponse, User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User | null>(null);
    token = new BehaviorSubject<string | null>(null);

    constructor(private http: HttpClient, private router: Router) { }

    register(email: string, password: string, role: string, image: File) {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('image', image);

        return this.http.post(`${environment.serverUrl}/auth/register`, formData)
        .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    login(email: string, password: string) {
        return this.http.post<{jwt_token: string}>(`${environment.serverUrl}/auth/login`, {
            email, password
        })
        .pipe(
            catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))),
            tap(responseData => {
                this.token.next(responseData.jwt_token);
                sessionStorage.setItem('token', responseData.jwt_token);
            })
        );
    }

    getUserProfile() {
        return this.http.get<GetUserProfileResponse>(`${environment.serverUrl}/users/me`)
            .pipe(
                tap(responseData => {
                    sessionStorage.setItem('userData', JSON.stringify(responseData.user));
                    this.user.next(responseData.user);
                })
            )
    }

    autoLogin() {
        const user = JSON.parse(sessionStorage.getItem('userData')!!);
        const token = sessionStorage.getItem('token');

        if (!user || !token) {
            return;
        }

        const loadedUser = new User(
            user._id,
            user.email,
            user.role,
            user.image,
            user.created_date
        );

        this.token.next(token);
        this.user.next(loadedUser);
    }

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        this.user.next(null);
        this.token.next(null);
        this.router.navigate(['/auth']);
    }

    changePassword(oldPassword: string, newPassword: string) {
        return this.http.patch(`${environment.serverUrl}/users/me/password`, {
            oldPassword, 
            newPassword
        })
        .pipe(
            catchError(errorRes => throwError(() => new Error(errorRes?.error?.message)))
        );
    }

    forgotPassword(email: string) {
        return this.http.post(`${environment.serverUrl}/auth/forgot_password`, {
            email
        })
        .pipe(
            catchError(errorRes => throwError(() => new Error(errorRes?.error?.message)))
        );
    }
}
