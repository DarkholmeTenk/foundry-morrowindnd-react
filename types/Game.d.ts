export {}

interface Game {
    users: DocumentCollection<User>
    actors: DocumentCollection<Actor>
    journal: DocumentCollection<JournalEntry>
    scenes: DocumentCollection<Scene>
    items: DocumentCollection<Item>,
    packs: DocumentCollection<CompendiumCollection<any>>
    tables: DocumentCollection<RollTable>
    user: User
    socket: Socket
    settings: ClientSettings

    i18n: {
        localize: (id: string)=>string
    }
}

interface UI {
    notifications: Notifications
}

declare global {
    let game: Game
    let ui: UI
}