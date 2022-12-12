import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { GetLoadDetailedInfo, LoadWithDriverAndMessages } from '../load.model';
import { LoadsService } from '../loads.service';
import { GeocodeService } from './geocode.service';

@Component({
    selector: 'app-load-details',
    templateUrl: './load-details.component.html',
    styleUrls: ['./load-details.component.css']
})
export class LoadDetailsComponent implements OnInit, OnDestroy {
    loadId!: string;
    load!: LoadWithDriverAndMessages;
    addressNotFound = false;
    checkedAddresses = 0;
    loading = false;
    user!: User;
    userSub!: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, 
        private loadsService: LoadsService, private geocodeService: GeocodeService,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.autoLogin();

        this.userSub = this.authService.user.subscribe(user => {
            this.user = user!!;
        })
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.loadId = params['loadId'];

                    if (this.loadId) {
                        this.loadsService.getLoadDetailedInfo(this.loadId!!).subscribe(load => {
                            this.load = load;
                            this.checkCoordinates(this.load.pickup_address);
                            this.checkCoordinates(this.load.delivery_address);
                        });
                    }
                }
            );
            
    }

    checkCoordinates(address: string) {
        this.loading = true;
        this.geocodeService.geocodeAddress(address)
            .subscribe({
                next: (_) => {
                    this.loading = false;
                    this.checkedAddresses += 1;
                },
                error: (_) => {
                    this.loading = false;
                    this.addressNotFound = true;
                    this.checkedAddresses += 1;
                }
            });
    }

    transformDate(date: string): Date {
        return new Date(date);
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
