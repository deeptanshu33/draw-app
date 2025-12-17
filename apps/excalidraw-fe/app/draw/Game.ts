import { getExistingShapes } from "./http";

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

type toolOptions = "circle" | "line" | "rectangle"

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket
    private currTool: toolOptions
    private clicked: boolean
    private startX = 0 
    private startY = 0

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.existingShapes = []
        this.roomId = roomId
        this.clicked = false
        this.currTool = "circle"
        this.socket = socket
        this.init()
        this.initSocketHandlers()
        this.initMouseHandlers()
    }


    async init() {
        this.existingShapes = await getExistingShapes(this.roomId)
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.strokeStyle = "rgba(255, 255, 255)"
        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            }
            if (shape.type === "circle") {
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI)
                this.ctx.stroke()
            }
        })
    }

    setTool(tool: toolOptions){
        this.currTool = tool
    }

    initSocketHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message)

            if (message.type === "join_room") {
                this.clearCanvas()
            }

            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message)
                console.log(parsedShape.shape)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas()
            }
        }
    }

    initMouseHandlers() {
        this.canvas?.addEventListener("mousedown", (e) => {
            this.clicked = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            console.log(e.clientX);
            console.log(e.clientY);
        })

        this.canvas?.addEventListener("mouseup", (e) => {
            this.clicked = false;
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            let shape: Shape | null = null;
            if (this.currTool == "rectangle") {
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    width,
                    height
                }
            }
            else if (this.currTool == "circle") {
                const radius = Math.abs(Math.max(width, height))
                shape = {
                    type: "circle",
                    centerX: this.startX + radius,
                    centerY: this.startY + radius,
                    radius: radius
                }
            }

            if (!shape) return;

            this.existingShapes.push(shape)

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId: Number(this.roomId)
            }))
        })

        this.canvas?.addEventListener("mousemove", (e) => {
            if (this.clicked) {
                const width = e.clientX - this.startX;
                const height = e.clientY - this.startY;
                this.clearCanvas()
                if (this.currTool == "rectangle") {
                    this.ctx.strokeStyle = "rgba(255, 255, 255)"
                    this.ctx.strokeRect(this.startX, this.startY, width, height)
                }
                else if (this.currTool == "circle") {
                    this.ctx.beginPath()
                    const radius = Math.abs(Math.max(width, height))
                    this.ctx.arc(this.startX + radius, this.startY + radius, radius, 0, 2 * Math.PI)
                    this.ctx.stroke()
                }
            }
        })
    }
}