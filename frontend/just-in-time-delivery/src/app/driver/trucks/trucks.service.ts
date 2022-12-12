import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetDriverTruckByIdInterface, GetDriverTrucksInterface } from './truck.model';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrucksService {

    constructor(private http: HttpClient) { }

    getDriverTrucks() {
        return this.http.get<GetDriverTrucksInterface>(`${environment.serverUrl}/trucks`);
    }

    assignTruckToDriver(truckId: string) {
        return this.http.post(`${environment.serverUrl}/trucks/${truckId}/assign`, {})
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    getDriverTruckById(truckId: string) {
        return this.http.get<GetDriverTruckByIdInterface>(`${environment.serverUrl}/trucks/${truckId}`)
            .pipe(
                map(response => response.truck)
            );
    }

    updateDriverTruckById(truckId: string, type: string) {
        return this.http.put(`${environment.serverUrl}/trucks/${truckId}`, { type })
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    createTruckForDriver(type: string) {
        return this.http.post(`${environment.serverUrl}/trucks`, { type })
            .pipe(catchError(errorRes => throwError(() => new Error(errorRes?.error?.message))));
    }

    deleteDriverTruck(truckId: string) {
        return this.http.delete(`${environment.serverUrl}/trucks/${truckId}`);
    }
}
