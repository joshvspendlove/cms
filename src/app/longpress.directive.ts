import { Directive, EventEmitter, ElementRef, HostListener, Input, Output, OnInit } from "@angular/core";
import { CmsEvent } from "./shared/cms-event.model";

@Directive({
    selector: '[cmsLongpress]'
})
export class LongPressDirective implements OnInit {
    @Input('cmsLongpress') defTimeoutLength: number;
    @Output() longpress = new EventEmitter<any>();
    timeout: any;
    timeoutLength: number = 1000

    @HostListener('mousedown', ["$event"]) beginPress(event: MouseEvent) {
        const longpressEvent = new CmsEvent({
                type:"longpress",
                x: event.clientX,
                y: event.clientY,
                target: this.elRef.nativeElement

        });

        this.timeout = setTimeout(() => {
            this.longpress.emit(longpressEvent);
            clearTimeout(this.timeout);
        }, this.timeoutLength);
    }

    @HostListener('mouseup') endPress() {
        clearTimeout(this.timeout);
    }

    @HostListener('mouseleave') leavePress() {
        clearTimeout(this.timeout);
    }

    constructor(private elRef: ElementRef) {}

    ngOnInit(): void {
        if (this.defTimeoutLength)
            this.timeoutLength = this.defTimeoutLength
    }
}
