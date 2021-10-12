import {NoteData} from "../Data/NoteData";
import {teleportation} from "../const";
import {shift} from "./canvas";
import {Circle, FillStyle, LineStyle} from "./SimpleParts";
import {getTeleportDestinations} from "../Data/NoteDataUtil";

export default class TPLayer extends PIXI.Container {
    constructor(private notes: NoteData[]) {
        super();
        this.draw()
    }

    draw() {
        let closest = getTeleportDestinations(canvas!.tokens!.controlled[0], this.notes)
        this.notes.forEach(({note, travel})=>{
            let matched = teleportation.filter(({id})=>travel[id])
            let count = matched.length
            matched.forEach(({id, color}, index)=>{
                let angle = (Math.PI / count) * index
                let position = shift(note.data, angle, 35)
                let fill: FillStyle | undefined = undefined
                let line: LineStyle = {width: 2, color}
                if(closest[id] && closest[id].some(x=>x.note.id == note.id)) {
                    fill = {color}
                    line = {width: 2, color: 0}
                }
                this.addChild(new Circle(10, position, line, fill))
            })
        })
    }
}