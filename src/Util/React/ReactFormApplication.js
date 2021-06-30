import ReactDOM from "react-dom";
import AppContext from "./AppContext";

export class ReactFormSheet extends FormApplication {
    xrendered = false

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
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
        let context = AppContext
        ReactDOM.render(<context.Provider value={this}>{component}</context.Provider>, document.getElementById(`react-${this.appId}`))
    }
}

export class SimpleReactFormSheet extends ReactFormSheet {
    constructor(component, ...rest) {
        super(...rest)
        this.component = component
    }

    getComponent() {
        return this.component
    }
}