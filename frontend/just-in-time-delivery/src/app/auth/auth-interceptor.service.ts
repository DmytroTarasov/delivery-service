import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = sessionStorage.getItem('token');

        if (!token) {
            return next.handle(req);
        }

        const modifiedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        if (req.url.includes('uploads/files') || req.url.includes('maps.googleapis.com')) {
            return next.handle(req);
        }

        return next.handle(modifiedRequest);
    }

}
