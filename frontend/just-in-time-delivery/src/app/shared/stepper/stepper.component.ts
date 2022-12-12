import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Load } from 'src/app/loads/load.model';
import { LoadsService } from 'src/app/loads/loads.service';

@Component({
    selector: 'app-stepper',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
    @Input() load!: Load;
    iteratingToNextState = false;
    @Output() tabIndexChanged = new EventEmitter<number>();

    constructor(private loadsService: LoadsService) { }

    ngOnInit(): void {}

    iterateToNextState() {
        this.iteratingToNextState = true;
        this.loadsService.iterateToNextLoadState().subscribe({
            next: (response) => {
                this.iteratingToNextState = false;
                this.load.state = response.message.split(`'`)[1];
                if (this.load.state === 'Arrived to Delivery') {
                    this.tabIndexChanged.emit(2);
                }
            },
            error: (errorMessage) => {
                this.iteratingToNextState = false;
            }
        });
    }
}
