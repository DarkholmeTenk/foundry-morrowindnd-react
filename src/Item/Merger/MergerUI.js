import {SimpleReactApplication} from "@darkholme/foundry-react-core/src/Util/ReactApplication";
import MergerUIComponent from "./MergerUIComponent";
import {getItemMapping} from "./Merger";

Hooks.on("renderActorSheet", (app, html)=>{
    let actor = app.object
    if(actor.data.type === "character" && (game.user.isGM || actor.owner)) {
        let mappings = getItemMapping(actor.items.entries)
        if(Object.keys(mappings).length > 0) {
            let part = html.find('.inventory-filters .filter-list')
            let button = $("<button style='line-height: normal; flex: 0.2'>Fix</button>")
            button.className = "filter-item"
            button.click((e)=>{
                new SimpleReactApplication(<MergerUIComponent actor={actor} mappings={mappings} />, {width: 600, height: 800 } ).render(true)
            })
            part.append(button)
        }
    }
})