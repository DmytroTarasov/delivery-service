import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileUploadComponent,
            multi: true
        }
    ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
    private file: File | null = null;
    onChange!: Function;
    previewUrl: string | ArrayBuffer | null = null;

    constructor(private host: ElementRef<HTMLInputElement>) { }

    ngOnInit() {}

    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        const file = event && event.item(0);
        this.onChange(file);
        this.file = file;

        const fileReader = new FileReader();

        fileReader.onload = () => {
            this.previewUrl = fileReader.result;
        }

        fileReader.readAsDataURL(file!!);
    }

    writeValue(value: any) {
        this.host.nativeElement.value = '';
        this.file = null;
    }

    registerOnChange(fn: Function) {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function) {}

}
