import { Component, OnInit } from '@angular/core';
import { Load } from '../loads/load.model';

@Component({
    selector: 'app-driver',
    templateUrl: './driver.component.html',
    styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
    load!: Load;
    selectedTabIndex!: number;

    constructor() { }

    ngOnInit(): void {}

    onTabIndexChanged(index: number) {
        this.selectedTabIndex = index;
    }
}
