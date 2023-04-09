import {NoteData} from "../Data/NoteData";
import {Circle, CircleLine} from "./SimpleParts";
import * as PIXI from "pixi.js"

export default class MageLayer extends PIXI.Container {
    constructor(private notes: NoteData[]) {
        super();
        this.draw()
    }

    draw() {
        let {notes} = this
        let mages = notes.filter(({ travel }) => travel.mages);
        if (mages.length > 1) {
            let center = mages.map(n => n.note).reduce((p, c) => ({ x: p.x + (c.x / mages.length), y: p.y + (c.y / mages.length) }), { x: 0, y: 0 });
            let mageContainer = this.addChild(new PIXI.Container());
            let mageGraphics = mageContainer.addChild(new PIXI.Graphics());
            let style = {width: 3, color: 0xc529ff}
            this.addChild(new Circle(20, center, style))
            mageGraphics.lineStyle(3, 0xc529ff)
                .drawCircle(center.x, center.y, 20);
            mages.forEach(mage => {
                this.addChild(new CircleLine(mage.note, center, style))
            });
        }
    }
}