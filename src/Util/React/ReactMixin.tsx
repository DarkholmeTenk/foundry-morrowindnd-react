import {ReactNode} from "react";
import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";

type Con<T extends Application> = new (...args: any[]) => T

export function Reactify<T extends Application>(Original: Con<T>) {
    let o = Original as any
    //@ts-ignore
    return class ReactApp extends Original {
        xrendered = false
        me: T

        constructor(props) {
            super(props);
            // @ts-ignore
            this.me = this
        }

        getComponent(): ReactNode {
            return <div>Incomplete</div>
        }

        static get defaultOptions() {
            return mergeObject(o.defaultOptions, {
                template: "modules/MorrowinDnDReact/templates/ReactApplication.hbs",
            })
        }

        getData(options) {
            return {id: this.appId};
        }

        async _render(force, ...args) {
            if(this.xrendered && !force) return
            this.xrendered = true

            await super._render(force, ...args);
            if(!force) return
            let component = this.getComponent()
            ReactDOM.render(<CoreBlock application={this.me}>
                {component}
            </CoreBlock>, document.getElementById(`react-${this.appId}`))
        }
    }
}