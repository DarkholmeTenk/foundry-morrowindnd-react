import {PropsWithChildren} from "react";
import ApplicationContext from "./ApplicationContext";
import {SelfSelector} from "./NewSelfSelector";
import {GmContext, GmContextControl, useGmState} from "./GmContext";
import {DocumentControls, MyDocument} from "./DocumentControls";
import Styles from "./CoreBlock.module.scss"
import {createTheme, ThemeProvider} from "@mui/material";
import {SuspenseContext} from "Util/Suspense/SuspenseContext";
import {SuspenseLayer} from "Util/Suspense/SuspenseLoadIndicator";
import {ReactObj} from "Util/React/ReactMixin";
import {MixinProvider} from "Util/React/core/MixinContext";

const theme = createTheme({
    palette: {
        primary: {
            main: "#44191A"
        },
        secondary: {
            main: "#7a7971"
        }
    }
})

interface CoreBlockProps {
    application: Application,
    document?: MyDocument,
    mixin: ReactObj
}
export function CoreBlock({children, application, document, mixin}: PropsWithChildren<CoreBlockProps>) {
    let [gm, setGm] = useGmState()
    return (
        <ApplicationContext.Provider value={application}>
            <MixinProvider mixin={mixin}>
                <SuspenseContext>
                    <ThemeProvider theme={theme}>
                        <GmContext state={gm}>
                            <div className={Styles.CoreBlock}>
                                <GmContextControl state={gm} setState={setGm} />
                                <SelfSelector />
                                {document && <DocumentControls doc={document} /> }
                            </div>
                            <SuspenseLayer>
                                {children}
                            </SuspenseLayer>
                        </GmContext>
                    </ThemeProvider>
                </SuspenseContext>
            </MixinProvider>
        </ApplicationContext.Provider>
    )
}