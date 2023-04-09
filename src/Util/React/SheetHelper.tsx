import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";
import {ReactApp, ReactObj} from "Util/React/ReactMixin";

export class ReactActorSheet extends ActorSheet implements ReactApp {
    reactObj = new ReactObj(this)

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: (super.defaultOptions.width ?? 0) + 120
        })
    }

    getComponent() {
        return <div>Test</div>;
    }
}

export class ReactItemSheet extends ItemSheet implements ReactApp {
    reactObj = new ReactObj(this)

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            width: (super.defaultOptions.width ?? 0) + 120,
            height: 700
        })
    }

    getComponent() {
        return <div />;
    }
}