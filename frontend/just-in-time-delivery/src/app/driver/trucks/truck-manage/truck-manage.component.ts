import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Truck } from '../truck.model';
import { TrucksService } from '../trucks.service';

@Component({
    selector: 'app-truck-manage',
    templateUrl: './truck-manage.component.html',
    styleUrls: ['./truck-manage.component.css']
})
export class TruckManageComponent implements OnInit {
    truckId!: string;
    updatingMode = false;
    truck!: Truck;
    truckForm!: FormGroup;
    errorMessage!: string;
    formSubmitting = false;

    constructor(private trucksService: TrucksService, private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.truckId = params['truckId'];

                    if (this.truckId) {
                        this.updatingMode = true;
                        this.trucksService.getDriverTruckById(this.truckId!!).subscribe(truck => {
                            this.truck = truck;
                
                            this.truckForm = new FormGroup({
                                'type': new FormControl(null, [Validators.required])
                            });
    
                            this.truckForm.setValue({
                                'type': this.truck!!.type
                            });
                        });
                    } else {
                        this.updatingMode = false;
                        this.truckForm = new FormGroup({
                            'type': new FormControl('SPRINTER', [Validators.required])
                        })
                    }
                }
            );
    }

    changeType(e: any) {
        this.type?.setValue(e.target.value, {
            onlySelf: true
        });
    }

    get type() {
        return this.truckForm.get('type');
    }

    onSubmit() {
        this.formSubmitting = true;
        let truckObservable: Observable<any>;
        
        if (this.updatingMode) {
            truckObservable = this.trucksService.updateDriverTruckById(this.truckId, this.type?.value);
        } else {
            truckObservable = this.trucksService.createTruckForDriver(this.type?.value);
        }

        truckObservable.subscribe({
            next: (_) => {
                this.formSubmitting = false;
                this.router.navigate(['/']);
            },
            error: (errorMessage) => {
                this.formSubmitting = false;
                this.errorMessage = errorMessage;
            }
        });
    }
}
