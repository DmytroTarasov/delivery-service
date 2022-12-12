import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { WebsocketService } from 'src/app/shared/websocket.service';
import { Truck } from './truck.model';
import { TrucksService } from './trucks.service';

@Component({
    selector: 'app-trucks',
    templateUrl: './trucks.component.html',
    styleUrls: ['./trucks.component.css']
})
export class TrucksComponent implements OnInit, OnDestroy {
    trucksLoading = false;
    driverTrucks: Truck[] = [];
    truckAssigning = false;
    errorMessage: string = '';
    assignedIdx: number | null = null;
    user!: User | null;
    truckDeleting = false;
    deletingIdx: number | null = null;
    userSub!: Subscription;

    constructor(private trucksService: TrucksService, private authService: AuthService,
        private router: Router, private websocketService: WebsocketService,
        public translateService: TranslateService) { }

    ngOnInit(): void {
        this.websocketService.setupSocketConnection();

        this.websocketService.onAssignTruckToDriver().subscribe({
            next: (data) => {
                this.onAssignTruckToDriver(data);
            }
        });

        this.trucksLoading = true;
        this.trucksService.getDriverTrucks()
            .subscribe(response => {
                this.trucksLoading = false;
                this.driverTrucks = response.trucks;
                this.assignedIdx = this.assignedTruckIndex;
            });
        
        this.userSub = this.authService.user.subscribe(user => {
            this.user = user;
        });
    }

    transformDate(date: string): Date {
        return new Date(date);
    }

    assignTruck(truckId: string, idx: number) {
        this.assignedIdx = idx;
        this.truckAssigning = true;
        this.trucksService.assignTruckToDriver(truckId).subscribe({
            next: (_) => {
                this.truckAssigning = false;
            },
            error: (errorMessage: string) => {
                this.truckAssigning = false;
                this.errorMessage = errorMessage;
            }
        });
    }

    navigateToManageTruckPage(updateMode: boolean, truckId?: string) {
        if (updateMode) {
            this.router.navigate([`/trucks/${truckId}/update`]);
        } else {
            this.router.navigate(['/trucks/create']);
        }
    }

    get driverTruckIsOnLoad() {
        return this.driverTrucks.filter(truck => truck.status === 'OL').length > 0;
    }

    get assignedTruckIndex() {
        const truck = this.driverTrucks.find(truck => truck.assigned_to !== null);
        
        return truck ? this.driverTrucks.indexOf(truck) : null;
    }

    onAssignTruckToDriver(data: any) {

        if (data.assignedBefore) {
            const assignedBeforeTruck = this.driverTrucks.find(truck => truck._id === data.assignedBeforeTruckId);
            if (assignedBeforeTruck) {
                assignedBeforeTruck.assigned_to = null; 
            }
        }
        
        let assignedTruck = this.driverTrucks.find(truck => truck._id === data.truckId);
        if (assignedTruck) {
            assignedTruck!!.assigned_to = this.user!!._id;
        }
    }

    deleteTruck(truckId: string, idx: number) {
        this.deletingIdx = idx;
        this.truckDeleting = true;
        this.trucksService.deleteDriverTruck(truckId)
            .subscribe({
                next: (_) => {
                    this.truckDeleting = false;
                    this.driverTrucks = [...this.driverTrucks.filter(truck => truck._id !== truckId)];
                }
            })
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}
