"use client"
import axios from "axios"
import { useRef } from "react"
import { BACKEND_URL } from "../config"
import { useRouter } from "next/navigation"
export function Dashboard() {
    async function handleRoomCreate() {
        if (createRef.current) {
            const roomName = createRef.current.value
            const res = await axios.post(`${BACKEND_URL}/room`, {
                name: roomName
            },
                {
                    withCredentials: true
                })
            const roomId = res.data.roomId
            router.push(`/canvas/${roomId}`)
        }
    }

    async function handleRoomJoin() {
        if (joinRef.current) {
            const roomName = joinRef.current.value
            const res = await axios.get(`${BACKEND_URL}/chat/${roomName}`)
            const roomId = res.data.roomId.id
            router.push(`/canvas/${roomId}`)
        }

    }

    const joinRef = useRef<HTMLInputElement>(null)
    const createRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    return <div className="bg-slate-950 h-screen flex justify-center items-center">
        <div className="flex gap-4">
            <div className="w-60 h-50 flex-col bg-slate-700 rounded-2xl p-2">
                <h1 className="text-center p-2 text-slate-200">Join an existing room</h1>
                <input ref={joinRef} className="block mx-auto p-4 border-2 rounded-xl focus:outline-0 border-slate-500" type="text" placeholder="enter existing room name" />
                <div className="flex justify-center p-2">
                    <button onClick={handleRoomJoin} type="submit" className="bg-blue-300 px-6 py-1 rounded text-black hover:cursor-pointer">join</button>
                </div>
            </div>
            <div className="w-60 h-50 flex-col bg-slate-700 rounded-2xl p-2">
                <h1 className="text-center p-2 text-slate-200">Create a new room</h1>
                <input ref={createRef} className="block mx-auto p-4 border-2 rounded-xl focus:outline-0 border-slate-500" type="text" placeholder="enter new room name" />
                <div className="flex justify-center p-2">
                    <button onClick={handleRoomCreate} type="submit" className="bg-blue-300 px-6 py-1 rounded text-black hover:cursor-pointer">create</button>
                </div>
            </div>
        </div>
    </div>
}