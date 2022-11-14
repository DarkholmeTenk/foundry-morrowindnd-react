import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";

export class ReactActorSheet extends ActorSheet {
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: super.defaultOptions.width + 120
        })
    }

    getData(options) {
        return {id: this.appId};
    }

    getComponent() {
        return <div />;
    }

    async _render(force, ...args) {
        if(this.xrendered && !force) return
        this.xrendered = true

        await super._render(force, ...args);
        if(!force) return
        let component = this.getComponent()
        ReactDOM.render(<CoreBlock application={this} document={this.object}>{component}</CoreBlock>, document.getElementById(`react-${this.appId}`))
    }
}

export class ReactItemSheet extends ItemSheet {
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: super.defaultOptions.width + 120,
            height: 700
        })
    }

    getData(options) {
        return {id: this.appId};
    }

    getComponent() {
        return <div />;
    }

    async _render(force, ...args) {
        if(this.xrendered && !force) return
        this.xrendered = true

        await super._render(force, ...args);
        if(!force) return
        let component = this.getComponent()
        ReactDOM.render(<CoreBlock application={this} document={this.object}>{component}</CoreBlock>, document.getElementById(`react-${this.appId}`))
    }
}