"use client"

import { useEffect, useRef, useState } from "react"
import { WS_URL } from "../config"
import { Canvas } from "./Canvas"

export function RoomCanvas({roomId}: {roomId: string}){
    
    const [socket, setSocket] = useState<WebSocket|null>(null)

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ODhkYjFmZS0yMjQ5LTQ3ZTEtYWYxYi0yYjUwMGM5MTA3ZGQiLCJpYXQiOjE3NjU3MDA4NTF9.qXPKkQb4L4U4PwyZlGzEkfj_xllfCAdAEQeFb5y4BBA`)
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: Number(roomId)
            }))
        }
    }, [])

    

    if(!socket){
        return(
            <div>
                Connecting to server...
            </div>
        )
    }

    return <Canvas roomId={roomId} socket={socket}/>
}