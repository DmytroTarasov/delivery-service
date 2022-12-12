import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { StepperComponent } from './stepper/stepper.component';
import { BasicHighlightDirective } from './basic-highlight.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgDatePipesModule } from 'ngx-pipes';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        FileUploadComponent,
        StepperComponent,
        BasicHighlightDirective
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        NgDatePipesModule,
        AgmCoreModule.forRoot({
            apiKey: '',
            language: 'en'
        }),
        AgmDirectionModule,
        TranslateModule
    ],
    exports: [
        FileUploadComponent,
        StepperComponent,
        BasicHighlightDirective,
        CommonModule,
        MatProgressSpinnerModule,
        NgDatePipesModule,
        AgmCoreModule,
        AgmDirectionModule,
        TranslateModule
    ]
})
export class SharedModule { }
