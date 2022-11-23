export {}

declare global {
    type NotificationType = "info" | "warning" | "error"
    type NotificationOption = Partial<{
        localize: boolean,
        permanent: boolean,
        console: boolean
    }>
    class Notifications {
        error(message: string, options?: NotificationOption)
        warning(message: string, options?: NotificationOption)
        info(message: string, options?: NotificationOption)
    }
}