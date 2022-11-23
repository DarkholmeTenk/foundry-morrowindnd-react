export {}
declare global {
    class Socket {
        on(id: string, callback: (result: unknown)=>void)
        emit(id: string, payload: unknown)
    }
}