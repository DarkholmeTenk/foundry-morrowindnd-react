import ReactDOM from "react-dom"
import AppContext from "./AppContext";

export default class ReactApplication extends Application {
    constructor(...args) {
        super(...args)
        this.xrendered = false
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowindndReact/templates/ReactApplication.hbs"
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
        let context = AppContext
        ReactDOM.render(<context.Provider value={this}>{component}</context.Provider>, document.getElementById(`react-${this.appId}`))
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