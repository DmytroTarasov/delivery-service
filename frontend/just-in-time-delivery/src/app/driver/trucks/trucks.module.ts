import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TrucksRoutingModule } from './trucks-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TruckManageComponent } from './truck-manage/truck-manage.component';

@NgModule({
    declarations: [
        TruckManageComponent
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        TrucksRoutingModule,
        SharedModule
    ]
})
export class TrucksModule { }
