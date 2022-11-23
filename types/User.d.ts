export {}
declare global {
    abstract class User extends DocumentBase {
        active: boolean
        isGM: boolean
        character?: Actor5e
    }
}
