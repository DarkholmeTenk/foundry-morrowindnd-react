import {ReactNode} from "react";
import {SimpleReactApplication} from "Util/React/ReactApplication";

type Options = ApplicationOptions & {
    width: number,
    height: number
}
export function openReactApplication(node: ReactNode, options: Options) {
    new SimpleReactApplication(node).render(true, options)
}