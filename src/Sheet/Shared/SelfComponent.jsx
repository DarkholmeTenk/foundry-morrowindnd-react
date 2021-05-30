import {Paper} from "@material-ui/core";
import Styles from "../MerchantSheet/MerchantSheet.module.scss";
import React from "react";
import GoldDisplay from "../../Util/Components/GoldDisplay";
import {getGoldAmountFromActor} from "../../Util/Helper/GoldHelper";

export default function SelfComponent({self, selfSelector}) {
    let myGoldAmount = self ? getGoldAmountFromActor(self.data) : null
    if(!self && !selfSelector) {
        return null
    } else {
        return <Paper classes={{root: Styles.paperDiv}}>
            {selfSelector}
            {self && <React.Fragment>My Gold: <GoldDisplay value={myGoldAmount} /></React.Fragment>}
        </Paper>
    }
}