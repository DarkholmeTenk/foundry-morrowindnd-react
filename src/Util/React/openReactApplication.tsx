import {ReactNode} from "react";
import RenderOptions = Application.RenderOptions;
import {SimpleReactApplication} from "./ReactApplication";

type Options = RenderOptions & {
    width: number,
    height: number
}
export function openReactApplication(node: ReactNode, options: Options) {
    new SimpleReactApplication(node).render(true, options)
}