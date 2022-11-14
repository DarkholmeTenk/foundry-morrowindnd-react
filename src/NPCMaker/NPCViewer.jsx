import {useContext} from "react";
import {useName} from "./NameHelper";
import {useVoice} from "./VoiceChooser";
import styles from "./NPCViewer.module.scss"
import {useImageChooser} from "./ImageChooser";
import {Button} from "@material-ui/core";
import {useNpcNameData} from "./NPCMakerApi";
import {setupFolder} from "../Util/Helper/FolderHelper";
import ApplicationContext from "../Util/React/core/ApplicationContext";

export default function NPCViewer({filtered, choice}) {
    let appContext = useContext(ApplicationContext)
    let {loading, data} = useNpcNameData()
    let {image, component: imageComponent} = useImageChooser(filtered)
    let {name, component: nameComponent} = useName(data, image, choice)
    let {voice, component: voiceComponent} = useVoice()

    if(loading || image == null) {
        return <div>
            No possible NPC
        </div>
    } else {
        return <div className={styles.viewer}>
            {imageComponent}
            <div className={styles.attributes}>
                {nameComponent}
                {voiceComponent}
                <Button onClick={async ()=>{
                    let folder = await setupFolder("npcs/generated", "Actor")
                    let actorData = {
                        name,
                        folder,
                        type: "npc",
                        img: image.path,
                        data: {
                            details: {
                                biography: {
                                    value: voice
                                }
                            }
                        },
                        token: {
                            img: image.path,
                            actorLink: true
                        }
                    }
                    await Actor.create(actorData, {renderSheet: true})
                    await appContext.close()
                }}>Save</Button>
            </div>
        </div>
    }
}