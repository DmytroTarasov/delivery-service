import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DownloadsService {

    constructor(private http: HttpClient) { }

    download(url: string) {
        return this.http.get(url, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Accept', 'application/pdf')
        });
    }
}
