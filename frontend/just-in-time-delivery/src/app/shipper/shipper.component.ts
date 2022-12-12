import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-shipper',
    templateUrl: './shipper.component.html',
    styleUrls: ['./shipper.component.css']
})
export class ShipperComponent implements OnInit {
    selectedTabIndex = 0;

    constructor() { }

    ngOnInit(): void {}

    onTabIndexChanged(index: number) {
        this.selectedTabIndex = index;
    }

}
