"use client"
import { useEffect, useRef, useState } from "react";
import { Circle } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { RectangleHorizontal } from 'lucide-react';
import { Game } from "../draw/Game";

export type toolOptions = "circle" | "pencil" | "rectangle"

export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [game, setGame] = useState<Game>()
    const [tool, setTool] = useState<toolOptions>('circle')

    useEffect(()=>{
        game?.setTool(tool)
    }, [tool, game])

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket)
            setGame(g)

            return ()=>{
                g.destroy()
            } 
        }
    }, [canvasRef])
    return (
        <div style={{height: "100vh", overflow:"hidden"}} className="bg-white relative h-screen">
            <canvas className="absolute inset-0 z-0" ref={canvasRef} width={2000} height={1000}></canvas>
            <div className="fixed top-4 left-[40%] z-10 flex gap-1 bg-slate-600 rounded-2xl text-white">
                <button onClick={()=>{setTool('circle')}} className={`p-4 rounded ${tool==="circle"?"text-red-400":"text-white"}`}><Circle/></button>
                <button onClick={()=>{setTool('pencil')}} className={`p-4 rounded ${tool==="pencil"?"text-red-400":"text-white"}`}><Pencil/></button>
                <button onClick={()=>{setTool('rectangle')}} className={`p-4 rounded ${tool==="rectangle"?"text-red-400":"text-white"}`}><RectangleHorizontal/></button>
            </div>
        </div>
    )
}