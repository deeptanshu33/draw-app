"use client"
import { useEffect, useRef, useState } from "react";
import { Pencil, MousePointer, Circle, RectangleHorizontal } from "lucide-react";
import { Game } from "../draw/Game";

export type toolOptions = "circle" | "pencil" | "rectangle" | "pointer"

const tools: { id: toolOptions; icon: typeof Pencil; label: string }[] = [
    { id: "pointer", icon: MousePointer, label: "Select & Pan" },
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "pencil", icon: Pencil, label: "Pencil" },
]

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [game, setGame] = useState<Game>()
    const [tool, setTool] = useState<toolOptions>("pointer")

    useEffect(() => {
        game?.setTool(tool)
    }, [tool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g)

            return () => {
                g.destroy()
            }
        }
    }, [canvasRef])

    return (
        <div
            style={{ height: "100vh", overflow: "hidden", background: "#0a0a0f" }}
            className="relative"
        >
            <canvas
                className="absolute inset-0 z-0"
                ref={canvasRef}
                width={2000}
                height={1000}
            />

            {/* Floating toolbar */}
            <div
                className="fixed top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1.5 animate-slide-down"
                style={{
                    background: "rgba(18, 18, 26, 0.85)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-xl)",
                    boxShadow:
                        "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
                }}
            >
                {tools.map((t, i) => {
                    const isActive = tool === t.id
                    const isPointerGroup = t.id === "pointer"
                    return (
                        <div key={t.id} className="flex items-center">
                            {/* Divider after pointer tool */}
                            {i === 1 && (
                                <div
                                    className="w-px h-6 mx-1"
                                    style={{ background: "var(--border-default)" }}
                                />
                            )}
                            <div className="relative group">
                                <button
                                    onClick={() => setTool(t.id)}
                                    className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
                                    style={{
                                        background: isActive
                                            ? "var(--accent-gradient)"
                                            : "transparent",
                                        color: isActive
                                            ? "#fff"
                                            : "var(--text-secondary)",
                                        boxShadow: isActive
                                            ? "0 2px 10px rgba(99,102,241,0.35)"
                                            : "none",
                                        cursor: "pointer",
                                        border: "none",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            ;(e.currentTarget as HTMLButtonElement).style.background =
                                                "var(--bg-surface-hover)"
                                            ;(e.currentTarget as HTMLButtonElement).style.color =
                                                "var(--text-primary)"
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            ;(e.currentTarget as HTMLButtonElement).style.background =
                                                "transparent"
                                            ;(e.currentTarget as HTMLButtonElement).style.color =
                                                "var(--text-secondary)"
                                        }
                                    }}
                                >
                                    <t.icon size={18} />
                                </button>

                                {/* Tooltip */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                                    style={{
                                        background: "var(--bg-tertiary)",
                                        color: "var(--text-primary)",
                                        border: "1px solid var(--border-default)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    {t.label}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}