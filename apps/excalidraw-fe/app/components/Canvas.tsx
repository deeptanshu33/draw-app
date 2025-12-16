"use client"
import { useEffect, useRef, useState } from "react";
import { Circle } from 'lucide-react';
import { Minus } from 'lucide-react';
import { RectangleHorizontal } from 'lucide-react';
import { initDraw } from "../draw/initDraw";

type toolOptions = "circle" | "line" | "rectangle"

export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [tool, setTool] = useState<toolOptions>('circle')

    useEffect(()=>{
        //@ts-ignore
        window.tool = tool
    }, [tool])

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket)
        }
    }, [canvasRef, tool])
    return (
        <div style={{height: "100vh", overflow:"hidden"}} className="bg-white relative h-screen">
            <canvas className="absolute inset-0 z-0" ref={canvasRef} width={2000} height={1000}></canvas>
            <div className="fixed top-4 left-10 z-10 flex gap-5 text-white">
                <button onClick={()=>{setTool('circle')}} className={`bg-slate-700 p-4 rounded ${tool==="circle"?"text-red-400":"text-white"}`}><Circle/></button>
                <button onClick={()=>{setTool('line')}} className={`bg-slate-700 p-4 rounded ${tool==="line"?"text-red-400":"text-white"}`}><Minus/></button>
                <button onClick={()=>{setTool('rectangle')}} className={`bg-slate-700 p-4 rounded ${tool==="rectangle"?"text-red-400":"text-white"}`}><RectangleHorizontal/></button>
            </div>
        </div>
    )
}