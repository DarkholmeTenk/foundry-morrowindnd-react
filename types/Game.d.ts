export {}

interface Game {
    users: DocumentCollection<User>
    actors: DocumentCollection<Actor>
    journal: DocumentCollection<JournalEntry>
    scenes: DocumentCollection<Scene>
    items: DocumentCollection<Item>,
    packs: DocumentCollection<CompendiumCollection<any>>
    tables: DocumentCollection<RollTable>
    messages: DocumentCollection<ChatMessage>
    folders: DocumentCollection<any>
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

interface Config {
    Canvas: {
        layers: Record<string, {group: 'interface', layerClass: new ()=>CanvasLayer}>
    }
}

declare global {
    let game: Game
    let ui: UI
    let CONFIG: Config
}