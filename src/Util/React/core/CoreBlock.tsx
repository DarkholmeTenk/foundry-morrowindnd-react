import {PropsWithChildren} from "react";
import ApplicationContext from "./ApplicationContext";
import {SelfContext, SelfSelector, useSelfState} from "./NewSelfSelector";
import {GmContext, GmContextControl, useGmState} from "./GmContext";
import {DocumentControls, MyDocument} from "./DocumentControls";

interface CoreBlockProps {
    application: Application,
    document?: MyDocument
}
export function CoreBlock({children, application, document}: PropsWithChildren<CoreBlockProps>) {
    let [self, setSelf] = useSelfState()
    let [gm, setGm] = useGmState()
    return (
        <ApplicationContext.Provider value={application}>
            <GmContext state={gm}>
                <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <GmContextControl state={gm} setState={setGm} />
                        <SelfSelector state={self} setState={setSelf} />
                        {document && <DocumentControls doc={document} /> }
                    </div>
                    <div>
                        <SelfContext.Provider value={self}>
                            {children}
                        </SelfContext.Provider>
                    </div>
                </div>
            </GmContext>
        </ApplicationContext.Provider>
    )
}