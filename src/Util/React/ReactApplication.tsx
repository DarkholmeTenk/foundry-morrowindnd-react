import {ReactApp, ReactObj} from "Util/React/ReactMixin";

export default class ReactApplication extends Application implements ReactApp {
    private reactObj = new ReactObj(this)

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs"
        })
    }

    getComponent(): Promise<JSX.Element> {
        throw Error("No component defined!")
    }
    superRender = (f, ...o)=>super._render(f, ...o)

    getData() {
        return {id: this.appId};
    }

    async _render(force, ...args) {
        await this.reactObj.render(force, ...args)
    }
}

export class SimpleReactApplication extends ReactApplication {
    constructor(private reactComponent, ...args) {
        super(...args)
    }

    getComponent() {
        return this.reactComponent
    }
}