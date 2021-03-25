import LootSheetComponent from "../../Token/LootSheet/LootSheetComponent";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";
import ReactDOM from "react-dom";

export class ReactActorSheet extends ActorSheet {
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/FoundryReactCore/src/Util/ReactApplication.hbs",
            width: super.defaultOptions.width + 120
        })
    }

    getData(options) {
        return {id: this.appId};
    }

    getComponent({npc, self}) {
        return <div />;
    }

    async _render(force, ...args) {
        if(this.xrendered && !force) return
        this.xrendered = true

        await super._render(force, ...args);
        if(!force) return
        let component = this.getComponent({npc: this.object, self: game.user.character})
        let context = AppContext
        ReactDOM.render(<context.Provider value={this}>{component}</context.Provider>, document.getElementById(`react-${this.appId}`))
    }
}