const ID = "module.MorrowinDnDReact";
let SocketHooks = {};
Hooks.on("ready", () => {
    game.socket.on(ID, result => {
        let id = result.id;
        let payload = result.payload;
        SocketHooks[id](payload);
    });
});
export function registerSocket(id, callback) {
    SocketHooks[id] = callback;
    return (payload) => {
        callback(payload);
        game.socket.emit(ID, { id, payload });
    };
}
export function registerGMSocket(id, callback) {
    return registerSocket(id, (x) => {
        if (!game.users.entities.some(u => u.isGM)) {
            ui.notifications.error("A GM must be online to perform this action");
            throw new Error("No GM Available");
        }
        if (game.user.isGM) {
            callback(x);
        }
    });
}
export function registerPlayerSocket(id, callback) {
    return registerSocket(id, (x) => {
        if (!game.user.isGM) {
            callback(x);
        }
    });
}
