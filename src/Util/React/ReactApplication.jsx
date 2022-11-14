import ReactDOM from "react-dom"
import {CoreBlock} from "./core/CoreBlock";

export default class ReactApplication extends Application {
    constructor(...args) {
        super(...args)
        this.xrendered = false
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs"
        })
    }

    getComponent() {
        throw Error("No component defined!")
    }

    getData(options) {
        return {id: this.appId};
    }

    async _render(force, ...args) {
        if(this.xrendered && !force) return
        this.xrendered = true

        await super._render(force, ...args);
        if(!force) return
        let component = await this.getComponent()
        ReactDOM.render(<CoreBlock application={this}>
            {component}
        </CoreBlock>, document.getElementById(`react-${this.appId}`))
    }
}

export class SimpleReactApplication extends ReactApplication {
    constructor(reactComponent, ...args) {
        super(...args)
        this.reactComponent = reactComponent
    }

    getComponent() {
        return this.reactComponent
    }
}