import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { HomeComponent } from './home/home.component';
import { DriverComponent } from './driver/driver.component';
import { TrucksComponent } from './driver/trucks/trucks.component';
import { HeaderComponent } from './header/header.component';
import { ShipperComponent } from './shipper/shipper.component';
import { LoadsComponent } from './loads/loads.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { TranslateCacheModule, TranslateCacheSettings, TranslateCacheService } from 'ngx-translate-cache';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        DriverComponent,
        TrucksComponent,        
        ShipperComponent,
        LoadsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatTabsModule,
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: translateLoaderFactory,
              deps: [HttpClient]
            }
        }),
        TranslateCacheModule.forRoot({
            cacheService: {
              provide: TranslateCacheService,
              useFactory: translateCacheFactory,
              deps: [TranslateService, TranslateCacheSettings]
            },
            cacheMechanism: 'Cookie'
        })
    ],
    exports: [TranslateModule],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { 
    constructor(translate: TranslateService, translateCacheService: TranslateCacheService) {
        translateCacheService.init();
        translate.addLangs(['en', 'uk']);
        const browserLang = translateCacheService.getCachedLanguage() || translate.getBrowserLang();
        translate.use(browserLang!!.match(/en|uk/) ? browserLang!! : 'en');
    }
}

export function translateLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

export function translateCacheFactory(
    translateService: TranslateService,
    translateCacheSettings: TranslateCacheSettings
) {
    return new TranslateCacheService(translateService, translateCacheSettings);
}
