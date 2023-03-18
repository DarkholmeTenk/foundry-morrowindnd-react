export {}

declare global {
    type WrapperFunction = (oldFunction: Function, ...args: any[]) => any

    const libWrapper: {
        register(packageId: string, target: string, wrapper: WrapperFunction, type?: "WRAPPER" | "MIXED")
    }
}