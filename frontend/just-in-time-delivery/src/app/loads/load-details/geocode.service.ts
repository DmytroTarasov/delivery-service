import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Observable, of, map, tap, defer, from, switchMap } from 'rxjs';

declare var google: any;

@Injectable({
    providedIn: 'root'
})
export class GeocodeService {
    private geocoder: any;

    constructor(private mapLoader: MapsAPILoader) { }

    private initGeocoder() {
        this.geocoder = new google.maps.Geocoder();
    }

    private waitForMapToLoad(): Observable<boolean> {
        if (!this.geocoder) {
            return defer(() => from(this.mapLoader.load()))
                .pipe(
                    tap(() => this.initGeocoder()),
                    map(() => true)
                );
        }
        return of(true);
    }

    geocodeAddress(location: string): Observable<any> {
        return this.waitForMapToLoad()
            .pipe(
                switchMap(() => {
                    return new Observable(observer => {
                        this.geocoder.geocode({ 'address': location }, (results: any, status: any) => {
                            if (status === google.maps.GeocoderStatus.OK) {
                                observer.next({
                                    lat: results[0].geometry.location.lat(),
                                    lng: results[0].geometry.location.lng()
                                });
                            } else {
                                console.log('Error: ', results, ', status: ', status);
                                observer.error();
                            }
                            observer.complete();
                        })
                    })
                })
            )
    }
}
