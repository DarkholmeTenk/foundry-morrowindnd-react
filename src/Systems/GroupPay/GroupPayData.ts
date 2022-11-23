import {RawActorId} from "../../Util/Identifiers/ActorID";

interface GroupPayRecord {
    id: string
    totalCost: number,
    offered: Record<string, number>
}
interface GroupPayData {
    toPay: GroupPayRecord[],
    paid: GroupPayRecord[]
}