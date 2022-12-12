import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './chat/chat.component';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { LoadManageComponent } from './load-manage/load-manage.component';
import { LoadsRoutingModule } from './loads-routing.module';

@NgModule({
    declarations: [
        LoadManageComponent,
        LoadDetailsComponent,
        ChatComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        LoadsRoutingModule,
        SharedModule
    ]
})
export class LoadsModule { }
