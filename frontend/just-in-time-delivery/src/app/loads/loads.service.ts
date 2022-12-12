import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError, of } from 'rxjs';
import { GetLoadDetailedInfo, GetLoadInterface, GetLoadsInterface, UpdateLoadInterface } from './load.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoadsService {

    constructor(private http: HttpClient) { }

    getLoads(limit = 5, offset = 0, status?: string) {
        let params = new HttpParams()
            .append('offset', offset)
            .append('limit', limit);
        if (status) {
            params = params.append('status', status);
        }
        return this.http.get<GetLoadsInterface>(`${environment.serverUrl}/loads`, { params });
    }

    getLoadById(loadId: string) {
        return this.http.get<GetLoadInterface>(`${environment.serverUrl}/loads/${loadId}`)
            .pipe(
                map(response => response.load)
            );
    }

    updateLoadById(loadId: string, load: UpdateLoadInterface) {
        return this.http.put(`${environment.serverUrl}/loads/${loadId}`, load)
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    createLoad(load: UpdateLoadInterface) {
        return this.http.post(`${environment.serverUrl}/loads`, load)
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    postLoad(loadId: string) {
        return this.http.post<{ message: string, driver_found: boolean }>(`${environment.serverUrl}/loads/${loadId}/post`, {})
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    getDriverActiveLoad() {
        return this.http.get<GetLoadInterface>(`${environment.serverUrl}/loads/active`)
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    iterateToNextLoadState() {
        return this.http.patch<{ message: string }>(`${environment.serverUrl}/loads/active/state`, {})
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    getLoadDetailedInfo(loadId: string) {
        return this.http.get<GetLoadDetailedInfo>(`${environment.serverUrl}/loads/${loadId}/shipping_info`)
        .pipe(
            map(response => response.load)
        );
    }

    deleteLoad(loadId: string) {
        return this.http.delete(`${environment.serverUrl}/loads/${loadId}`);
    }

}
