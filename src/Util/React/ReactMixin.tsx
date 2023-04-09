import ReactDOM from "react-dom";
import {CoreBlock} from "./core/CoreBlock";

export type Con<T extends Application> = new (...args: any[]) => T

export interface ReactApp {
    getComponent(): Promise<JSX.Element> | JSX.Element
    superRender: (force: boolean, ...args)=>Promise<void>
    document?: DocumentBase
}

export class ReactObj {
    private hasRendered = false
    private root: any = null

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
        ReactDOM.render(<CoreBlock application={this.application} document={this.application.document}>
            {component}
        </CoreBlock>, document.getElementById(`react-${this.application.appId}`))
    }
}