"use client"
import axios from "axios"
import { useRef, useState } from "react"
import { BACKEND_URL } from "../config"
import { useRouter } from "next/navigation"
import { Pencil, Plus, LogIn, ArrowRight, Loader2 } from "lucide-react"

export function Dashboard() {
    const joinRef = useRef<HTMLInputElement>(null)
    const createRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const [creatingRoom, setCreatingRoom] = useState(false)
    const [joiningRoom, setJoiningRoom] = useState(false)

    async function handleRoomCreate() {
        if (createRef.current && createRef.current.value.trim()) {
            setCreatingRoom(true)
            try {
                const roomName = createRef.current.value
                const res = await axios.post(
                    `${BACKEND_URL}/room`,
                    { name: roomName },
                    { withCredentials: true }
                )
                const roomId = res.data.roomId
                router.push(`/canvas/${roomId}`)
            } catch (err) {
                console.log(err)
                setCreatingRoom(false)
            }
        }
    }

    async function handleRoomJoin() {
        if (joinRef.current && joinRef.current.value.trim()) {
            setJoiningRoom(true)
            try {
                const roomName = joinRef.current.value
                const res = await axios.get(`${BACKEND_URL}/chat/${roomName}`)
                const roomId = res.data.roomId.id
                router.push(`/canvas/${roomId}`)
            } catch (err) {
                console.log(err)
                setJoiningRoom(false)
            }
        }
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: "var(--bg-primary)" }}
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)",
                }}
            />

            {/* Header */}
            <header
                className="relative z-10 flex items-center justify-between px-8 py-5"
                style={{ borderBottom: "1px solid var(--border-default)" }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--accent-gradient)" }}
                    >
                        <Pencil size={16} className="text-white" />
                    </div>
                    <span
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        DrawBoard
                    </span>
                </div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Dashboard
                </p>
            </header>

            {/* Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-2xl animate-slide-up">
                    <h1
                        className="text-3xl font-bold text-center mb-2"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Your Workspace
                    </h1>
                    <p
                        className="text-center mb-10"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Create a new room or join an existing one to start collaborating
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Create Room Card */}
                        <div className="glass-card p-6 flex flex-col">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                                style={{
                                    background: "var(--accent-gradient)",
                                    boxShadow: "0 4px 15px rgba(99,102,241,0.25)",
                                }}
                            >
                                <Plus size={20} className="text-white" />
                            </div>
                            <h2
                                className="text-lg font-semibold mb-1"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Create a Room
                            </h2>
                            <p
                                className="text-sm mb-5"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Start a fresh canvas and invite collaborators
                            </p>
                            <input
                                ref={createRef}
                                className="input-field mb-4"
                                type="text"
                                placeholder="Room name"
                            />
                            <button
                                onClick={handleRoomCreate}
                                className="btn-primary w-full"
                                disabled={creatingRoom}
                            >
                                {creatingRoom ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Create <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Join Room Card */}
                        <div className="glass-card p-6 flex flex-col">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                                style={{
                                    background: "var(--bg-surface-hover)",
                                    border: "1px solid var(--border-default)",
                                }}
                            >
                                <LogIn size={20} style={{ color: "var(--accent-from)" }} />
                            </div>
                            <h2
                                className="text-lg font-semibold mb-1"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Join a Room
                            </h2>
                            <p
                                className="text-sm mb-5"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Enter a room name to join an existing session
                            </p>
                            <input
                                ref={joinRef}
                                className="input-field mb-4"
                                type="text"
                                placeholder="Room name"
                            />
                            <button
                                onClick={handleRoomJoin}
                                className="btn-ghost w-full"
                                disabled={joiningRoom}
                            >
                                {joiningRoom ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Join <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}