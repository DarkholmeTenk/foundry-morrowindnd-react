import {ReactApp, ReactObj} from "Util/React/ReactMixin";

export default class ReactFormApplication<T> extends FormApplication<T> implements ReactApp {
    reactObj = new ReactObj(this)

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs"
        })
    }

    getComponent(): Promise<JSX.Element> {
        throw Error("No component defined!")
    }
}

export class SimpleReactFormSheet<T> extends ReactFormApplication<T> {
    constructor(private component, a?: T, b?: any) {
        super(a, b)
    }

    getComponent() {
        return this.component
    }

    async _updateObject(event, formData) {
        return null
    }
}