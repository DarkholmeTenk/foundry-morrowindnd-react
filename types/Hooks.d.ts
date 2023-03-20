export {}

declare global {
    type HookCallback = (...args: any[])=>unknown
    class Hooks {
        static on(event: string, callback: HookCallback, options?: {once: boolean}): number
        static off(event: string, callback: number | HookCallback)
        static once(event: string, callback: HookCallback)
        static call(event: string, ...args: any[])
        static callAll(event: string, ...args: any[])
    }
}