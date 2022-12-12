import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Load } from '../load.model';
import { LoadsService } from '../loads.service';

@Component({
  selector: 'app-load-manage',
  templateUrl: './load-manage.component.html',
  styleUrls: ['./load-manage.component.css']
})
export class LoadManageComponent implements OnInit {
    loadId!: string;
    updatingMode = false;
    load!: Load;
    loadForm!: FormGroup;
    errorMessage!: string;
    formSubmitting = false;

    constructor(private loadsService: LoadsService, private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.loadId = params['loadId'];

                    if (this.loadId) {
                        this.updatingMode = true;
                        this.loadsService.getLoadById(this.loadId!!).subscribe(load => {
                            this.load = load;
                
                            this.loadForm = new FormGroup({
                                'name': new FormControl(null, [Validators.required]),
                                'payload': new FormControl(null, [Validators.required]),
                                'pickup_address': new FormControl(null, [Validators.required]),
                                'delivery_address': new FormControl(null, [Validators.required]),
                                'width': new FormControl(null, [Validators.required]),
                                'height': new FormControl(null, [Validators.required]),
                                'length': new FormControl(null, [Validators.required])
                            });
    
                            this.loadForm.setValue({
                                'name': this.load!!.name,
                                'payload': this.load!!.payload,
                                'pickup_address': this.load!!.pickup_address,
                                'delivery_address': this.load!!.delivery_address,
                                'width': this.load!!.dimensions.width,
                                'height': this.load!!.dimensions.height,
                                'length': this.load!!.dimensions.length
                            });
                        });
                    } else {
                        this.updatingMode = false;
                        this.loadForm = new FormGroup({
                            'name': new FormControl(null, [Validators.required]),
                            'payload': new FormControl(null, [Validators.required]),
                            'pickup_address': new FormControl(null, [Validators.required]),
                            'delivery_address': new FormControl(null, [Validators.required]),
                            'width': new FormControl(null, [Validators.required]),
                            'height': new FormControl(null, [Validators.required]),
                            'length': new FormControl(null, [Validators.required])
                        });
                    }
                }
            );
    }

    onSubmit() {
        let load = {
            name: this.loadForm.get('name')!!.value,
            payload: this.loadForm.get('payload')!!.value,
            pickup_address: this.loadForm.get('pickup_address')!!.value,
            delivery_address: this.loadForm.get('delivery_address')!!.value,
            dimensions: {
                width: this.loadForm.get('width')!!.value,
                height: this.loadForm.get('height')!!.value,
                length: this.loadForm.get('length')!!.value
            }
        }
        this.formSubmitting = true;
        let loadObservable: Observable<any>;
        
        if (this.updatingMode) {
            loadObservable = this.loadsService.updateLoadById(this.loadId, load);
        } else {
            loadObservable = this.loadsService.createLoad(load);
        }

        loadObservable.subscribe({
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
