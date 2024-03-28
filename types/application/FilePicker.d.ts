export {}

declare global {
    interface FilePickerOptions {
        current: string
        callback: (x: string)=>void
        type: "image" | "sound"
    }

    class FilePicker extends Application{
        constructor(options?: Partial<FilePickerOptions>)
    }
}