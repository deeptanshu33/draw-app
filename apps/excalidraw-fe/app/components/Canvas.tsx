"use client"
import { useEffect, useRef } from "react";
import { initDraw } from "../draw/initDraw";

export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket)
        }
    }, [canvasRef])
    return (
        <div className="bg-white h-screen">
            <canvas ref={canvasRef} width={2000} height={1000}></canvas>
        </div>
    )
}