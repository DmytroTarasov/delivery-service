import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoadReportsService {

    constructor(private http: HttpClient) {} 

    generateReports() {
        return this.http.post(`${environment.serverUrl}/reports`, {});
    }
}
