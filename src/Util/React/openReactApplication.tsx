import {ReactNode} from "react";
import {SimpleReactApplication} from "./ReactApplication";

type Options = ApplicationOptions & {
    width: number,
    height: number
}
export function openReactApplication(node: ReactNode, options: Options) {
    new SimpleReactApplication(node).render(true, options)
}