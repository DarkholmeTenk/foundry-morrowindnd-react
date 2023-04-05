import {PropsWithChildren} from "react";
import ApplicationContext from "./ApplicationContext";
import {SelfSelector} from "./NewSelfSelector";
import {GmContext, GmContextControl, useGmState} from "./GmContext";
import {DocumentControls, MyDocument} from "./DocumentControls";
import Styles from "./CoreBlock.module.scss"

interface CoreBlockProps {
    application: Application,
    document?: MyDocument
}
export function CoreBlock({children, application, document}: PropsWithChildren<CoreBlockProps>) {
    let [gm, setGm] = useGmState()
    return (
        <ApplicationContext.Provider value={application}>
            <GmContext state={gm}>
                <div>
                    <div className={Styles.CoreBlock}>
                        <GmContextControl state={gm} setState={setGm} />
                        <SelfSelector />
                        {document && <DocumentControls doc={document} /> }
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </GmContext>
        </ApplicationContext.Provider>
    )
}