export {}

declare global {
    class ChatMessage {
        static create(message: {content: string}): Promise<ChatMessage>
    }
}