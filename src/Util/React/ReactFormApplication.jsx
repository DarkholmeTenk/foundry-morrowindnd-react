import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";
import {Reactify} from "./ReactMixin";
import {ReactNode} from "react";

export class ReactFormSheet extends Reactify(FormApplication) {}

export class SimpleReactFormSheet extends ReactFormSheet {
    constructor(component, ...args) {
        super(...args)
        this.component = component
    }

    getComponent() {
        return this.component
    }

    async _updateObject(event, formData) {
        return null
    }
}