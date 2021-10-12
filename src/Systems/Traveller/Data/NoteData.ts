export interface TravelInfo {
    target: string,
    cost: number,
    hours: number
}

export interface TravelData {
    isTravel: boolean,
    isDark: boolean
    almsivi: boolean,
    divine: boolean,
    direct: boolean,
    mages: boolean,
    siltstrider: TravelInfo[],
    boat: TravelInfo[],
    propylon: TravelInfo[]
}

export interface NoteData {
    note: NoteDocument,
    entry: JournalEntry,
    travel: TravelData
}