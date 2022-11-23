export {}

declare global {
    interface ApplicationOptions {
        width: number
        height: number
    }

    class Application {
        static get defaultOptions(): Partial<ApplicationOptions>
        render(force?: boolean, options?: object)
        close()
    }

    class FormApplication<T> extends Application {
        object: T
    }
}