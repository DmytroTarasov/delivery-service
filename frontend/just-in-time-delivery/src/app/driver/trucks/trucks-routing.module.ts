import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { TruckManageComponent } from './truck-manage/truck-manage.component';

const routes: Routes = [
    {
        path: '', canActivate: [AuthGuard], children: [
            { path: ':truckId/update', component: TruckManageComponent },
            { path: 'create', component: TruckManageComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrucksRoutingModule { }
