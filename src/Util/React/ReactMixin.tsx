import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";

export type Con<T extends Application> = new (...args: any[]) => T

export interface ReactApp {
    getComponent(): Promise<Element>
    superRender: (force: boolean, ...args)=>Promise<void>
}

export class ReactObj {
    private hasRendered = false
    constructor(
        private application: Application & ReactApp
    ) {
    }

    async render(force: boolean, ...args: any[]) {
        if(this.hasRendered && !force) return
        this.hasRendered = true

        await this.application.superRender(force, ...args)
        if(!force) return
        let component = await this.application.getComponent()
        ReactDOM.render(<CoreBlock application={this.application}>
            {component}
        </CoreBlock>, document.getElementById(`react-${this.application.appId}`))
    }
}