import {getGoldString} from "./Helper/GoldHelper";

type MessagePart = string | {name: string} | {"type": "gp", value: number}
type Message = MessagePart[] | string

async function loadPart(part: MessagePart): Promise<string> {
    if(typeof part === "string")
        return part
    if("name" in part)
        return part.name
    if("type" in part) {
        if(part.type === "gp")
            return getGoldString(part.value)
    }
    return ""
}

async function createMessage(message: Message): Promise<string> {
    if(typeof message === "string") return message
    let parts = await message.mapAsync(loadPart)
    return "<p>" + parts.join(" ") + "</p>"
}

export class Messages {
    private messageSoFar: Message[] = []

    addMessage(...parts: MessagePart[]) {
        this.messageSoFar.push(parts)
    }

    addBreak() {
        this.messageSoFar.push("<hr>")
    }

    async send() {
        let messages = await this.messageSoFar.mapAsync(createMessage)
        let finalMessage = messages.join("")
        await ChatMessage.create({content: finalMessage})
    }
}