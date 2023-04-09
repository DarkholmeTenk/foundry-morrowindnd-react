export {}

declare global {
    interface ApplicationOptions {
        width: number
        height: number
    }

    class Application {
        constructor(...args: any[])

        appId: string

        static get defaultOptions(): Partial<ApplicationOptions>
        getData(options: any): any
        render(force?: boolean, options?: object)
        _render(force?: boolean, options?: object)
        close(): Promise<void>
    }

    abstract class FormApplication<T> extends Application {
        protected constructor(object?: T, options?: any)

        object: T

        getData(): any
    }
}