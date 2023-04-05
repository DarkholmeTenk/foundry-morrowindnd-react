export {}

declare global {
    class ChatMessage extends DocumentBase {
        static create(message: {content: string}): Promise<ChatMessage>
    }
}