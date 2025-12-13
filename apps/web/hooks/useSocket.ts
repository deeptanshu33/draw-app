import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
    const [loading, setLoading] = useState(true)
    const [socket, setSocket] = useState<WebSocket>()

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjMjQxNDM4YS0xNTY1LTQwOGItYjY5NC0yZTJhN2U0ZDNlMTYiLCJpYXQiOjE3NjU1Mzk1NDh9.pXPBrOgDcu_3SacQRWa_HAzEvJqAK0m2KI77iR_msUs`);
        ws.onopen = () => {
            setLoading(false)
            setSocket(ws)
        }
    }, [])

    return {
        socket, loading
    }
}