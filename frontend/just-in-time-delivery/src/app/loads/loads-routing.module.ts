import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ChatComponent } from './chat/chat.component';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { LoadManageComponent } from './load-manage/load-manage.component';

const routes: Routes = [
    {
        path: '', canActivate: [AuthGuard], children: [
            { path: ':loadId/update', component: LoadManageComponent },
            { path: 'create', component: LoadManageComponent },
            { path: ':loadId/chat', component: ChatComponent },
            { path: ':loadId', component: LoadDetailsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoadsRoutingModule { }
