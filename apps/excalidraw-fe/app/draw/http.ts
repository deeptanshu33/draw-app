import axios from "axios"
import { BACKEND_URL } from "../config"

export async function getExistingShapes(roomId:string){
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`,{
        headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ODhkYjFmZS0yMjQ5LTQ3ZTEtYWYxYi0yYjUwMGM5MTA3ZGQiLCJpYXQiOjE3NjU3MDA4NTF9.qXPKkQb4L4U4PwyZlGzEkfj_xllfCAdAEQeFb5y4BBA"
        }
    })
    const messages = res.data.chats

    const shapes = messages.map((x:{message: string}) => {
        const messageData = JSON.parse(x.message)
        // console.log(messageData.shape)
        return messageData.shape
    })

    return shapes
}