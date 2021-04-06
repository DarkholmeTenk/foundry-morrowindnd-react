import {useContext} from "react";
import AppContext from "@darkholme/foundry-react-core/src/Util/AppContext";
import {useName} from "./NameHelper";
import {useVoice} from "./VoiceChooser";
import styles from "./NPCViewer.module.scss"
import {useImageChooser} from "./ImageChooser";
import {setupFolder} from "@darkholme/foundry-react-core/src/Util/FolderHelper";
import {Button} from "@material-ui/core";
import {useNpcNameData} from "./NPCMakerApi";

export default function NPCViewer({filtered, choice}) {
    let appContext = useContext(AppContext)
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
                        }
                    }
                    await Actor.create(actorData, {renderSheet: true})
                    appContext.close()
                }}>Save</Button>
            </div>
        </div>
    }
}