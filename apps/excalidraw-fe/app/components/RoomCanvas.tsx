"use client"

import { useEffect, useState } from "react"
import { WS_URL } from "../config"
import { Canvas } from "./Canvas"
import { Pencil } from "lucide-react"

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}`)
        ws.onopen = () => {
            setSocket(ws)
            ws.send(
                JSON.stringify({
                    type: "join_room",
                    roomId: Number(roomId),
                })
            )
        }
    }, [])

    if (!socket) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-5"
                style={{ background: "var(--bg-primary)" }}
            >
                {/* Ambient glow */}
                <div
                    className="pointer-events-none fixed inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 40% 40% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-in">
                    {/* Spinning logo */}
                    <div className="relative">
                        <div className="spinner" style={{ width: 48, height: 48 }} />
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Pencil size={18} style={{ color: "var(--accent-from)" }} />
                        </div>
                    </div>

                    <div className="text-center">
                        <p
                            className="text-sm font-medium mb-1"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Connecting to room
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Establishing WebSocket connection…
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return <Canvas roomId={roomId} socket={socket} />
}