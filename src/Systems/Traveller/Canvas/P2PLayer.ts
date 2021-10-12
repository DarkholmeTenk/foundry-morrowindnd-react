import {NoteData} from "../Data/NoteData";
import {p2pRoutes, P2PRouteType} from "../const";
import {CircleLine} from "./SimpleParts";
import {TravellerSettings} from "../Settings";

function getText(fromNote, toNote, fromEntry, toEntry, travel) {
    let text = {
        aboveText: TravellerSettings.ShowNames.value ? `${fromEntry.name} ↔ ${toEntry.name}` : undefined,
        belowText: TravellerSettings.ShowPriceTime.value ? `${travel.cost}gp - ${travel.hours} hours` : undefined
    }
    // if(travel.hours && text.belowText) {
    //     text.belowText += `  ${Math.round(distance(fromNote, toNote) / travel.hours)}`
    // }
    if(!travel.cost || !travel.hours) delete text.belowText;
    return text;
}


class SingleP2PLayer extends PIXI.Container {
    constructor(private notes: NoteData[], private type: P2PRouteType) {
        super();
        this.draw()
    }

    draw() {
        let {id, color} = this.type
        let done: Record<string, boolean> = {};
        this.notes.forEach(({ note, entry, travel }) => {
            let routes = travel[id] || [];
            routes.forEach(route => {
                let target = route.target;
                if (done[`${target}_${entry.id}`])
                    return;
                done[`${target}_${entry.id}`] = true;
                done[`${entry.id}_${target}`] = true;
                let { note: targetNote, entry: targetEntry } = this.notes.find(({ entry: e }) => e.id === target) || {};
                if (targetNote) {
                    let text = getText(note, targetNote, entry, targetEntry, route)
                    this.addChild(new CircleLine(note.data, targetNote.data, {width: 3, color}, text))
                }
            });
        });
    }
}

export default class P2PLayer extends PIXI.Container {
    constructor(private notes: NoteData[]) {
        super();
        this.draw()
    }

    draw() {
        p2pRoutes.forEach((x)=>{
            if(x.setting.value) {
                this.addChild(new SingleP2PLayer(this.notes, x))
            }
        })

    }
}