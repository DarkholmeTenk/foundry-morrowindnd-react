export async function callRoll(roll: string = "1"): Promise<number> {
    let r = new Roll(roll)
    let res = await r.evaluate({async: true})
    return res.total
}