import {defaultShift, shift} from "./canvas";
import {SimplePos} from "./SimpleParts";

interface TextData {
    text: string,
    fill?: number,
    fontSize?: number,
    angle: number,
    center: SimplePos,
    stroke?: number,
    strokeThickness?: number,
    shiftAmount?: number
}

function getTextAngle(angle) {
    if(angle > Math.PI / 2 && angle < 3 * (Math.PI / 2) || angle < -(Math.PI/2)) {
        return Math.PI + angle
    }
    return angle
}

export default class AngledText extends PIXI.Container {
    constructor(private textData: TextData) {
        super();
        this.zIndex = 10000
        let {angle, center, shiftAmount} = this.textData
        let textAngle = getTextAngle(angle)
        let textPos = shift(center, textAngle + (Math.PI / 2),  shiftAmount ?? defaultShift)
        this.rotation = getTextAngle(textData.angle)
        this.position.set(textPos.x, textPos.y)
        this.draw()
    }

    draw() {
        let {text, fill, fontSize, stroke, strokeThickness} = this.textData
        let textObj = new PIXI.Text(text, {
            fontSize: fontSize ?? 48,
            fill: fill ?? 0,
            fontWeight: "bold",
            stroke: stroke ?? 0xFFFFFF,
            strokeThickness: strokeThickness ?? 4
        });
        textObj.scale.set(0.5);
        textObj.anchor.set(0.5);
        this.addChild(textObj);
    }
}