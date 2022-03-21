export async function callRoll(roll: string = "1"): Promise<number> {
    let r = new Roll(roll)
    let res = await r.roll({async: true})
    return res.total ?? 0
}