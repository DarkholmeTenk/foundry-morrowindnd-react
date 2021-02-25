import {useCallback, useEffect, useState} from "react";
import {randomIndex} from "@darkholme/foundry-react-core/src/Util/Util";
import RefreshButton from "../Util/RefreshButton";
import styles from "./ImageChooser.module.scss"

function ImageChooser({length, index, setIndex, setRandom}) {
    return <div className={styles.buttonHolder}>
        <i className="fas fa-chevron-left" onClick={()=>setIndex(Math.max(index - 1, 0))}/>
        {index + 1} / {length}
        <i className="fas fa-chevron-right" onClick={()=>setIndex(Math.min(index + 1, length - 1))}/>
        <RefreshButton onClick={setRandom} />
    </div>
}

export function useImageChooser(images) {
    let [index, setIndex] = useState(0)
    let refresh=useCallback(()=>setIndex(randomIndex(images)), [images])
    useEffect(refresh, [images])
    let image = images[index]
    let component;
    if(image) {
        component = <div>
            <img src={image.path} width="256px"/>
            <ImageChooser length={images.length} index={index} setIndex={setIndex} setRandom={refresh} />
        </div>
    } else {
        component = <div>No images</div>
    }
    return {image, component}
}