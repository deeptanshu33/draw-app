import type { WebSocket } from "ws"
export type User = {
    ws: WebSocket,
    rooms: string[],
    userId: string
}