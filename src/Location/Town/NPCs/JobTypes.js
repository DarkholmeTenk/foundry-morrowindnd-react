import { SpellSeller } from "../SpellSeller/SpellSeller";
import SpellSellerComponent from "../SpellSeller/SpellSellerComponent";
export var JobType;
(function (JobType) {
    JobType["Mage"] = "SpellSeller";
})(JobType || (JobType = {}));
export const JobTypeDataMap = {
    [JobType.Mage]: {
        name: "Spell Seller",
        component: SpellSellerComponent,
        clazz: SpellSeller
    }
};
