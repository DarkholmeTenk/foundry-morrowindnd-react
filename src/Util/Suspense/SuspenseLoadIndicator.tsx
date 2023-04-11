import {CircularProgress} from "@mui/material";
import {PropsWithChildren, Suspense} from "react";

export function SuspenseLoadIndicator() {
    return <div>
        <CircularProgress />
    </div>
}

export function SuspenseLayer({children}: PropsWithChildren) {
    return <Suspense fallback={<SuspenseLoadIndicator />}>
        {children}
    </Suspense>
}