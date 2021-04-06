import * as React from "react";
import PackSelectorComponent from "./PackSelectorComponent";
import {SimpleReactFormSheet} from "../../Util/Helper/ReactFormApplication";

export class PackSelector extends SimpleReactFormSheet {
    constructor(...args) {
        super(<PackSelectorComponent setting={args} />, ...args)
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 400,
            height: 300
        })
    }
}