import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";
import {ReactApp, ReactObj} from "Util/React/ReactMixin";

export class ReactActorSheet extends ActorSheet implements ReactApp {
    reactObj = new ReactObj(this)
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: (super.defaultOptions.width ?? 0) + 120
        })
    }

    getData() {
        return {id: this.appId};
    }

    getComponent() {
        return <div>Test</div>;
    }
    superRender = (a,b)=>super._render(a,b)

    async _render(force, ...args) {
        await this.reactObj.render(force, ...args)
    }
}

export class ReactItemSheet extends ItemSheet implements ReactApp {
    reactObj = new ReactObj(this)
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: (super.defaultOptions.width ?? 0) + 120,
            height: 700
        })
    }

    getData() {
        return {id: this.appId};
    }

    getComponent() {
        return <div />;
    }
    superRender = (f,a)=>super._render(f, a)

    async _render(force, ...args) {
        await this.reactObj.render(force, ...args)
    }
}