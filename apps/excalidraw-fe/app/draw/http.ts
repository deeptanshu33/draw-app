import axios from "axios"
import { BACKEND_URL } from "../config"

export async function getExistingShapes(roomId:string){
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`,{
        withCredentials: true
    })
    const messages = res.data.chats

    const shapes = messages.map((x:{message: string}) => {
        const messageData = JSON.parse(x.message)
        // console.log(messageData.shape)
        return messageData.shape
    })

    return shapes
}