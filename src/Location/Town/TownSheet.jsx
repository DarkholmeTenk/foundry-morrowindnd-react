import PropTypes from "prop-types"
import {TownScene} from "./TownScene";
import TownMerchantViewer from "./Merchant/TownMerchantViewer";

export default function TownSheet({townScene}) {
    let merchants = townScene.getMerchants()
    return <div>
        <TownMerchantViewer merchants={merchants} />
    </div>
}
TownSheet.propTypes = {
    townScene: PropTypes.instanceOf(TownScene)
}