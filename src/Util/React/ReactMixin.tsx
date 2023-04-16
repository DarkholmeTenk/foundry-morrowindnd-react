import {CoreBlock} from "./core/CoreBlock";
import {createRoot, Root} from "react-dom/client";
import {openReactApplication} from "Util/React/openReactApplication";
import {ClosePreventionModal} from "Util/React/core/MixinContext";

export type Con<T extends Application> = new (...args: any[]) => T

export interface ReactApp {
    getComponent(): Promise<JSX.Element> | JSX.Element
    document?: DocumentBase
    reactObj: ReactObj
}

type AppKey<A extends Application> = keyof A
type Fun = (...args: any[])=>any
type Params<A extends Application, K extends AppKey<A>> = A[K] extends Fun ? Parameters<A[K]> : never
type Ret<A extends Application, K extends AppKey<A>> = A[K] extends Fun ? ReturnType<A[K]> : never
function wrap<A extends Application, K extends AppKey<A>>(app: A, t: K, fun: (old: A[K], ...args: Params<A, K>)=>Ret<A, K>) {
    let oldFunction = app[t] as Function
    let bound = oldFunction.bind(app)
    let a = app as any
    a[t] = function (...args: Params<A, K>) {
        return fun(bound, ...args)
    }
}

interface Options {
    skipWrap?: boolean
}

export class ReactObj {
    private hasRendered = false
    private root: Root | null = null
    private closeStoppers = 0

    constructor(
        private application: Application & ReactApp,
        private options: Options = {}
    ) {
        if(!(options?.skipWrap)) {
            this.wrapClose();

            wrap(application, "getData", ()=>{
                return {id: application.appId}
            })

            wrap(application, "_render", async(old, force, ...options)=>{
                if(this.hasRendered && !force) return
                this.hasRendered = true
                await old(force, ...options)

                let component = await this.application.getComponent()
                this.renderComponent(component)
            })

            if(application instanceof FormApplication) {
                wrap(application, "submit", async ()=>{})
            }
        }
    }

    private wrapClose() {
        wrap(this.application, "close", async (old) => {
            if(this.closeStoppers > 0) {
                openReactApplication(<ClosePreventionModal forceClose={()=>this.hardClose()} />, {width: 600, height: 100})
                return
            }
            this.unmount()
            await old()
        })
    }

    stopClosing(enable: boolean) {
        if (enable)
            this.closeStoppers++
        else
            this.closeStoppers--
    }

    async hardClose() {
        this.closeStoppers = 0
        await this.application.close()
    }

    renderComponent(component) {
        let element = document.getElementById(`react-${this.application.appId}`)?.parentElement
        if(!element) throw Error("No element")
        this.root = createRoot(element)
        this.root.render(<CoreBlock application={this.application} document={this.application.document} mixin={this}>
            {component}
        </CoreBlock>)
    }

    unmount() {
        this.root?.unmount()
    }
}