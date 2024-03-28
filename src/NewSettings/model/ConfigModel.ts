interface ConfigSetting<T> {
    key: string
    name?: string
    hint?: string
    defaultValue: T;
    scope?: "client" | "world",
    inConfig?: boolean
    requiresReload?: boolean
}

interface NumSetting extends ConfigSetting<number> {
    type: typeof Number
    range?: {
        min: number,
        max: number,
        step: number
    }
}

interface StrSetting extends ConfigSetting<string> {
    type: typeof String
    choices?: { [key: string]: string }
}

