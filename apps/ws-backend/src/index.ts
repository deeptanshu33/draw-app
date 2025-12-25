import { WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "./types"
import { JWT_SECRET } from '@repo/backend-common/config';
import {prismaClient} from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

const users: User[] = []

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        if (typeof (decoded) == "string") return null
        if (!decoded || !decoded.userId) return null

        return decoded.userId
    } catch (error) {
        return null
    }
}

wss.on('connection', function connection(ws, request) {
    // const url = request.url
    // if (!url) return;
    // const queryParams = new URLSearchParams(url.split("?")[1])
    // const token = queryParams.get('token') || ""

    // const userId = checkUser(token)

    // if (!userId) {
    //     ws.close()
    //     return;
    // }

    const cookieHeader = request.headers.cookie
    if(!cookieHeader){
        ws.close()
        return
    }

    const cookies = Object.fromEntries(
        cookieHeader.split("; ").map(c => c.split("="))
    )

    const access_token = cookies.access_token

    if(!access_token){
        ws.close()
        return
    }

    const userId = checkUser(access_token)

    if(!userId){
        ws.close()
        return
    }

    users.push({
        userId: userId,
        rooms: [],
        ws
    })

    ws.on('message', async function message(data) {
        let parsedData;
        if(typeof data !== "string"){
            parsedData = JSON.parse(data.toString())
        }
        else{
            parsedData = JSON.parse(data)
        }
        
        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws)
            user?.rooms.push(parsedData.roomId)
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws)
            if (!user) return;
            user.rooms = user.rooms.filter(x => x !== parsedData.roomId)
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId
            const message = parsedData.message

            //use a queue to send messages
            await prismaClient.chat.create({
                data:{
                    roomId,
                    message,
                    userId
                }
            })

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }
    });

});