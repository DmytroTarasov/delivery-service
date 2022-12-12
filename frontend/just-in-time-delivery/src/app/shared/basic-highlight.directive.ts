import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appBasicHighlight]'
})
export class BasicHighlightDirective {
    @Input('appBasicHighlight') currentLoadState: string = '';

    constructor(private elementRef: ElementRef) { }

    ngOnInit(): void {
        if (this.elementRef.nativeElement.textContent.toUpperCase() === this.currentLoadState) {
            this.elementRef.nativeElement.style.backgroundColor = '#dff0d8';
            this.elementRef.nativeElement.style.border = '2px solid green';
        }
    }
}
