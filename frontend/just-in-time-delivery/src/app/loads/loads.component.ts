import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadsService } from './downloads.service';
import { Load } from './load.model';
import { LoadsService } from './loads.service';

import { saveAs } from 'file-saver-es';
import { LoadReportsService } from './load-reports.service';
import { WebsocketService } from '../shared/websocket.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-loads',
    templateUrl: './loads.component.html',
    styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit {
    loadsLoading = false;
    loads: Load[] = [];
    errorMessage: string = '';
    loadPosting = false;
    postingIdx!: number;
    limit = 2;
    offset = 0;
    selectedTabIndex!: number;
    generatingLoadReports = false;
    generatedLoadReports = false;
    loadsMoreLoading = false;
    noMoreLoadsAvailable = false;
    deletingIdx!: number;
    loadDeleting = false;
    @Output() tabIndexChanged = new EventEmitter<number>();
    @Input() status!: string;
    @Input() driverMode!: boolean;

    constructor(private loadsService: LoadsService, private router: Router,
        private downloadsService: DownloadsService, private loadReportsService: LoadReportsService,
        private websocketService: WebsocketService, public translateService: TranslateService) { }

    ngOnInit(): void {
        this.loadsLoading = true;

        if (this.status === 'ASSIGNED') {
            this.websocketService.setupSocketConnection();

            this.websocketService.onLoadIteratedToNextState().subscribe({
                next: (data) => {
                    this.iterateToNextLoadStateEvent(data);
                }
            });
        }

        if (this.driverMode && this.status === 'ASSIGNED') {
            this.loadsService.getDriverActiveLoad()
                .subscribe(response => {
                    this.loadsLoading = false;
                    if (response.load !== null) {
                        this.loads = [response.load];
                    }
                });
        } else {
            this.loadsService.getLoads(this.limit, this.offset, this.status)
                .subscribe(response => {
                    this.loadsLoading = false;
                    this.loads = response.loads;
                    this.offset += this.limit;
                });
        }

    }

    iterateToNextLoadStateEvent(data: any) {

        let updatedLoad = this.loads.find(load => load._id === data.loadId);

        if (data.status === 'SHIPPED') {
            this.loads = [...this.loads.filter(load => load._id !== data.loadId)];
            this.selectedTabIndex = 3;
            this.tabIndexChanged.emit(this.selectedTabIndex);
        }

        if (updatedLoad) {
            updatedLoad.state = data.state;
        }
    }

    transformDate(date: string): Date {
        return new Date(date);
    }

    navigateToLoadManagePage(updateMode: boolean, loadId?: string) {
        if (updateMode) {
            this.router.navigate([`/loads/${loadId}/update`]);
        } else {
            this.router.navigate(['/loads/create']);
        }
    }

    postLoad(loadId: string, idx: number) {
        this.postingIdx = idx;
        this.loadPosting = true;
        this.loadsService.postLoad(loadId)
            .subscribe({
                next: (response: { message: string, driver_found: boolean }) => {
                    this.loadPosting = false;
                    this.loads = [...this.loads.filter(load => load._id !== loadId)];
                    // go to the tab with posted/assigned loads
                    this.selectedTabIndex = response.driver_found ? 2 : 1;
                    this.tabIndexChanged.emit(this.selectedTabIndex);
                },
                error: (errorMessage) => {
                    this.loadPosting = false;
                    this.errorMessage = errorMessage;
                }
            })
    }

    onTabIndexChanged(idx: number) {
        this.selectedTabIndex = idx;
        this.tabIndexChanged.emit(this.selectedTabIndex);
    }

    download() {
        this.downloadsService.download('http://localhost:8080/uploads/files/loadReports.pdf')
            .subscribe(blob => {
                saveAs(blob, 'loadReports.pdf'); 
            });
    }

    generateReports() {
        this.generatingLoadReports = true;
        this.loadReportsService.generateReports()
            .subscribe({
                next: (_) => {
                    this.generatingLoadReports = false;
                    this.generatedLoadReports = true;
                }
            })
    }

    loadMoreLoads() {
        this.loadsMoreLoading = true;
        this.loadsService.getLoads(this.limit, this.offset, this.status)
            .subscribe(response => {
                this.loadsMoreLoading = false;
                this.loads = [...this.loads, ...response.loads];
                this.offset += this.limit;
                if (response.loads.length < this.limit) {
                    this.noMoreLoadsAvailable = true;
                }
            });
    }

    navigateToLoadDetailsPage(loadId: string) {
        this.router.navigate([`/loads/${loadId}`]);
    }

    navigateToChatPage(loadId: string) {
        this.router.navigate([`/loads/${loadId}/chat`]);
    }

    deleteLoad(loadId: string, idx: number) {
        this.deletingIdx = idx;
        this.loadDeleting = true;
        this.loadsService.deleteLoad(loadId)
            .subscribe({
                next: (_) => {
                    this.loadDeleting = false;
                    this.loads = [...this.loads.filter(load => load._id !== loadId)];
                    this.offset -= 1;
                }
            });
    }
}
