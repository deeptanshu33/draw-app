import axios from "axios";
import { BACKEND_URL, TEMP_JWT } from "../app/config";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId: string){
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {
        headers: {
            Authorization: `${TEMP_JWT}`
        }
    })
    return response.data.chats
}

export async function ChatRoom({id}: {id:string}){
    const messages = await getChats(id)
    return <ChatRoomClient id={id} messages={messages} />
}