import { ElementRef } from "@angular/core";

export class CmsEvent {
    target: ElementRef
    x: number
    y: number
    type: string

    constructor(data: Object){
        if (data.hasOwnProperty("target"))
            this.target = data["target"]
        if (data.hasOwnProperty("x"))
            this.x = data["x"]
        if (data.hasOwnProperty("y"))
            this.y = data["y"]
        if (data.hasOwnProperty("type"))
            this.type = data["type"]
    }

}