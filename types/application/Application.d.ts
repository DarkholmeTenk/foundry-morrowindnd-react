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
        render(force?: boolean, options?: object)
        _render(force?: boolean, options?: object)
        close()
    }

    abstract class FormApplication<T> extends Application {
        protected constructor(object?: T, options?: any)

        object: T

        abstract getData(): any
    }
}