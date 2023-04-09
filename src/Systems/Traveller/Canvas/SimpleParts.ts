import {defaultShift, shift} from "./canvas";
import AngledText from "./AngledText";
import * as PIXI from "pixi.js"

export interface LineStyle {
    width?: number,
    color?: number,
    alpha?: number
}

export interface FillStyle {
    color: number,
    alpha?: number
}

export interface LineText {
    aboveText?: string,
    belowText?: string
}

export interface SimplePos {
    x: number,
    y: number
}

export class Circle extends PIXI.Container {
    graphics: PIXI.Graphics = this.addChild(new PIXI.Graphics())
    constructor(private myRadius: number, pos: SimplePos, private line?: LineStyle, private fill?: FillStyle) {
        super()
        this.position.set(pos.x, pos.y)
        this.draw()
    }

    draw() {
        this.graphics.clear()
        let temp = this.graphics
        if(this.line) {
            temp = temp.lineStyle(this.line?.width ?? 2, this.line?.color ?? 0, this.line?.alpha ?? 1)
        }
        if(this.fill) {
            temp = temp.beginFill(this.fill.color, this.fill.alpha)
        }
        temp.drawCircle(0, 0, this.myRadius)
    }
}

export class CircleLine extends PIXI.Container {
    graphics: PIXI.Graphics = this.addChild(new PIXI.Graphics())
    constructor(private pos1: SimplePos, private pos2: SimplePos, private line: LineStyle, private text?: LineText, private myRadius: number = 20) {
        super()
        this.draw()
    }

    draw() {
        this.graphics.clear()
        let graphics = this.graphics.lineStyle(this.line?.width ?? 2, this.line?.color ?? 0, this.line?.alpha ?? 1)
        let {pos1, pos2, myRadius} = this
        let angle = Math.atan2(pos1.y - pos2.y, pos1.x - pos2.x)
        let newPos1 = shift(pos1, angle, 20)
        let newPos2 = shift(pos2, Math.PI + angle, myRadius)
        graphics.moveTo(newPos1.x, newPos1.y)
            .lineTo(newPos2.x, newPos2.y)
        let center = {x: (newPos1.x + newPos2.x) / 2, y: (newPos1.y + newPos2.y) / 2}
        let {aboveText, belowText} = (this.text ?? {})
        if(aboveText) {
            this.addChild(new AngledText({text: aboveText, center, angle, shiftAmount: defaultShift}))
        }
        if(belowText) {
            this.addChild(new AngledText({text: belowText, center, angle, shiftAmount: -defaultShift}))
        }
    }
}