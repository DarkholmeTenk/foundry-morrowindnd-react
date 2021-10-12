export async function loadUuid<T>(uuid: string): Promise<T | null> {
    let obj = await fromUuid(uuid)
    return obj as any as T
}

export async function loadSUuid<T>(uuid: string): Promise<T> {
    let o = await loadUuid<T>(uuid)
    return o!
}