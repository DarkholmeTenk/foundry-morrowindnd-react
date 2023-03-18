import {getSceneNoteData} from "../Data/NoteDataUtil.ts";
import { TravellerSettings } from "../Settings.js";
import LogFactory from "../../../Util/Logging";
import {Circle} from "./SimpleParts";
import TPLayer from "./TPLayer";
import MageLayer from "./MageLayer";
import P2PLayer from "./P2PLayer";

const log = LogFactory("Traveller_Canvas")
export const defaultShift = 16;

export function shift({x, y}, angle, radius = 20) {
    return {x: x - (radius * Math.cos(angle)), y: y - (radius * Math.sin(angle))}
}

class NoteCircle extends Circle {
    constructor(isDark, x, y) {
        super(20, {x, y}, {color: isDark ? 0 : 0xFFFFFF});
    }
}

export class TravelCanvasLayer extends InteractionLayer {
    graphics = null

    static get layerOptions() {
        return mergeObject(super.layerOptions, {
            zIndex: 600
        })
    }

    draw() {
        if(!TravellerSettings.ShowTravel.value) return this
        this.children.forEach(x=>x.destroy({children: true}))
        this.graphics = this.addChild(new PIXI.Graphics())
        log.debug("Redrawing canvas travel map")
        let notes = getSceneNoteData(canvas.scene)
        log.debug(`Identified ${notes.length} nodes to draw`, notes)
        this.addChild(new TPLayer(notes))
        if(TravellerSettings.ShowMages.value) this.addChild(new MageLayer(notes))
        this.addChild(new P2PLayer(notes))
        notes.forEach(({note, travel})=>{
            this.addChild(new NoteCircle(travel.isDark, note.x, note.y))
        })

        return this;
    }
}

log("Setting up canvas hooks")

Hooks.once("init", canvas => {
    log("Initted Canvas Travel Layer")
    CONFIG.Canvas.layers['TravelCanvasLayer'] = {group: "interface", layerClass: TravelCanvasLayer}
});

export async function refresh() {
    let args = arguments
    log.debug("Refreshing", args)
    let tcl = canvas.layers.find(x=>x instanceof TravelCanvasLayer)
    tcl.removeChildren()
    await tcl.draw()
}


Hooks.on("createNote", refresh)
Hooks.on("updateNote", refresh)
Hooks.on("deleteNote", refresh)
Hooks.on("controlToken", refresh)
Hooks.on("updateToken", ()=>setTimeout(refresh, 1000))
Hooks.on("updateJournalEntry", refresh)