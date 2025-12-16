import axios from "axios";
import { BACKEND_URL } from "../config";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
        centerX: number;
        centerY: number;
        radius: number;
    }

export async function initDraw(canvas: HTMLCanvasElement, roomId:string, socket: WebSocket) {
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    let existingShapes: Shape[] = []

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message)

        if(message.type === "join_room"){
            clearCanvas(existingShapes, ctx, canvas)
        }
        
        if(message.type === "chat"){
            const parsedShape = JSON.parse(message.message)
            console.log(parsedShape.shape)
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, ctx, canvas)
        }
    }

    existingShapes = await getExistingShapes(roomId)
    //@ts-ignore
    const currTool = window.tool
    console.log(currTool)
    console.log(existingShapes)
    clearCanvas(existingShapes, ctx, canvas)
    let clicked = false;
    let startX = 0;
    let startY = 0;
    // ctx.fillStyle = "rgba(0, 0, 0)"
    // ctx.fillRect(0, 0, canvas.width, canvas.height)

    canvas?.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        console.log(e.clientX);
        console.log(e.clientY);
    })

    canvas?.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        let shape:Shape|null = null;
        if(currTool=="rectangle"){
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            }
        }
        else if(currTool=="circle"){
            const radius = Math.abs(Math.max(width, height))
            shape = {
                type: "circle",
                centerX: startX + radius,
                centerY: startY + radius,
                radius: radius
            }
        }
        
        if(!shape) return;

        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: Number(roomId)
        }))
    })

    canvas?.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, ctx, canvas)
            if(currTool=="rectangle"){
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.strokeRect(startX, startY, width, height)
            }
            else if(currTool=="circle"){
                ctx.beginPath()
                const radius = Math.abs(Math.max(width, height))
                ctx.arc(startX + radius, startY+radius, radius, 0, 2*Math.PI)
                ctx.stroke()
            }
        }
    })
}

function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "rgba(255, 255, 255)"
    existingShapes.map((shape)=>{
        if(shape.type === "rect"){
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
        if(shape.type==="circle"){
            ctx.beginPath()
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2*Math.PI)
            ctx.stroke()
        }
    })
}

async function getExistingShapes(roomId:string){
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