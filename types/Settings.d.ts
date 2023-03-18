export {}

declare global {
    interface SettingData {
        name: string
        hint?: string
        scope: "client" | "world"
        type: any,
        default?: any,
        onChange?: (value: any)=>void
        requiresReload?: boolean
    }

    interface SettingMenuData {
        name: string,
        hint?: string,
        label?: string,
        icon?: string,
        type: typeof FormApplication,
        restricted?: boolean
    }

    class ClientSettings {
        register(namespace: string, key: string, data: SettingData)
        registerMenu(namespace: string, key: string, data: SettingMenuData)
        get(namespace: string, key: string): any
        set(namespace: string, key: string, value: any): Promise<void>
    }
}