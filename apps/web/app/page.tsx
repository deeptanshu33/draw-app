"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter()
  return (
    <div style={{
      height:'100vh',
      width:'100vw',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    }}>
      <input style={{padding:10}} value={roomId} onChange={(e)=>{
        setRoomId(e.target.value)
      }} type="text" placeholder="Enter Room Id" />
      <button style={{padding:10}} onClick={()=>{
        router.push(`/room/${roomId}`)
      }}>Join Room</button>
    </div>
  );
}
