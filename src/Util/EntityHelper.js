import { useEffect, useState } from "react";
export function useEntity({ type, entity }) {
    let [current, setCurrent] = useState(entity);
    useEffect(() => {
        let hookID = Hooks.on(`update${type}`, (newActor) => {
            setCurrent(newActor);
        });
        return () => Hooks.off(`update${type}`, hookID);
    }, [entity.id]);
    return { value: current };
}
export function useNPC(actor) {
    let [current, setCurrent] = useState({ actor });
    useEffect(() => {
        if (!actor)
            return;
        let hookID = 0;
        let type = actor.isToken ? "Token" : "Actor";
        if (actor.isToken) {
            hookID = Hooks.on(`updateToken`, (scene, newData, change) => {
                if (newData.id !== actor.id && newData._id !== actor.id && newData.id !== actor.token.id && newData._id !== actor.token.id)
                    return;
                setCurrent({ actor: new Token(newData, scene).actor });
            });
        }
        else {
            hookID = Hooks.on(`updateActor`, (newActor) => {
                if (newActor.id !== actor.id)
                    return;
                setCurrent({ actor: newActor });
            });
        }
        return () => Hooks.off(`update${type}`, hookID);
    }, [actor?.id]);
    return { value: current.actor };
}
