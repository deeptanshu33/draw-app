import { start } from "repl";
import { toolOptions } from "../components/Canvas";
import { getExistingShapes } from "./http";
import { screenToWorldCoordinates } from "./utils"

type Point = {
    x: number,
    y: number
}

type viewportObject = {
    x: number,
    y: number,
    scale: number
}

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
} | {
    type: "pencil";
    points: Point[]
}

export class Game {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private existingShapes: Shape[]
    private roomId: string
    private socket: WebSocket
    private currTool: toolOptions
    private currPath: Point[]
    private clicked: boolean
    private viewportTransform:viewportObject
    private startX = 0
    private startY = 0
    private viewportX = 0
    private viewportY = 0

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.existingShapes = []
        this.currPath = []
        this.viewportTransform = {
            x: 0,
            y: 0,
            scale: 1
        }
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
        this.clearCanvas()
    }

    destroy() {
        this.canvas?.removeEventListener("mousedown", this.mousedownHandler)
        this.canvas?.removeEventListener("mouseup", this.mouseupHandler)
        this.canvas.removeEventListener("mouseleave", this.mouseupHandler)
        window.removeEventListener("mouseup", this.mouseupHandler)
        this.canvas?.removeEventListener("mousemove", this.mousemoveHandler)
    }

    updatePanning = (e: MouseEvent) => {
        const localX = e.clientX
        const localY = e.clientY

        this.viewportTransform.x += localX - this.viewportX
        this.viewportTransform.y += localY - this.viewportY

        this.viewportX = localX
        this.viewportY = localY
    }

    updateZooming = (e:WheelEvent) => {
        const oldX = this.viewportTransform.x
        const oldY = this.viewportTransform.y

        const localX = e.clientX
        const localY = e.clientY

        const previousScale = this.viewportTransform.scale
        
        let newScale = (this.viewportTransform.scale += e.deltaY*-0.01)
        newScale = Math.min(4, Math.max(0.2, newScale))

        const newX = localX - (localX - oldX) * (newScale / previousScale)
        const newY = localY - (localY - oldY) * (newScale / previousScale)

        this.viewportTransform.x = newX
        this.viewportTransform.y = newY
        this.viewportTransform.scale = newScale
    }

    clearCanvas() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.setTransform(
            this.viewportTransform.scale,
            0,
            0,
            this.viewportTransform.scale,
            this.viewportTransform.x,
            this.viewportTransform.y    
        )
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
            if (shape.type === "pencil"){
                if(shape.points.length<2) return;
                const [firstPoint, ...rest] = shape.points
                this.ctx.lineCap = "round"
                this.ctx.beginPath()
                this.ctx.moveTo(firstPoint.x, firstPoint.y)
                rest.forEach(p => this.ctx.lineTo(p.x, p.y))
                this.ctx.stroke()
            }
        })
    }

    setTool(tool: toolOptions) {
        this.clicked = false
        this.currPath = []

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

    mousedownHandler = (e: MouseEvent) => {
        const {worldX: fX, worldY: fY} = screenToWorldCoordinates(e.clientX, e.clientY, this.viewportTransform.x, this.viewportTransform.y ,this.viewportTransform.scale)
        if(this.currTool=="pencil"){
            this.currPath.push({
                x: fX,
                y: fY
            })
        }
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.viewportX = e.clientX
        this.viewportY = e.clientY
    }

    mouseupHandler = (e: MouseEvent) => {
        if(!this.clicked) return;
        this.clicked = false;
        const {worldX: cwX, worldY: cwY} = screenToWorldCoordinates(e.clientX, e.clientY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
        const {worldX: swX, worldY: swY} = screenToWorldCoordinates(this.startX, this.startY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
        const width = cwX - swX
        const height = cwY - swY 
        let shape: Shape | null = null;
        if (this.currTool == "rectangle") {
            shape = {
                type: "rect",
                x: swX,
                y: swY,
                width,
                height
            }
        }
        else if (this.currTool == "circle") {
            const radius = Math.abs(Math.max(width, height))
            shape = {
                type: "circle",
                centerX: swX + radius,
                centerY: swY + radius, 
                radius: radius
            }
        }
        else if (this.currTool == "pencil"){
            if(this.currPath.length < 2) return;
            shape = {
                type: "pencil",
                points: this.currPath
            }
            this.currPath = []
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
    }

    mousemoveHandler = (e: MouseEvent) => {
        if (this.clicked==true) {
            const {worldX: cwX, worldY: cwY} = screenToWorldCoordinates(e.clientX, e.clientY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
            const {worldX: swX, worldY: swY} = screenToWorldCoordinates(this.startX, this.startY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
            
            const width = cwX - swX
            const height = cwY - swY
            if (this.currTool == "pencil"){
                const currX = e.clientX
                const currY = e.clientY

                const {worldX: prevWX, worldY: prevWY} = screenToWorldCoordinates(this.startX, this.startY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
                const {worldX, worldY} = screenToWorldCoordinates(currX, currY, this.viewportTransform.x, this.viewportTransform.y, this.viewportTransform.scale)
                
                this.ctx.lineCap = 'round'
                this.ctx.beginPath()
                // this.ctx.moveTo(this.startX, this.startY)
                // this.ctx.lineTo(currX, currY)
                this.ctx.moveTo(prevWX, prevWY)
                this.ctx.lineTo(worldX, worldY)
                this.ctx.stroke()
                
                this.currPath.push({x:worldX, y:worldY})
                this.startX = currX
                this.startY = currY
                
                return;
            }

            this.clearCanvas()

            if (this.currTool == "rectangle") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(swX, swY, width, height)
            }
            else if (this.currTool == "circle") {
                this.ctx.beginPath()
                const radius = Math.abs(Math.max(width, height))
                this.ctx.arc(swX + radius, swY + radius, radius, 0, 2 * Math.PI)
                this.ctx.stroke()
            }
            else if(this.currTool == "pointer"){
                this.updatePanning(e)
                return;
            }
        }
    }

    mousewheelHandler = (e: WheelEvent) => {
        console.log("zoom")
        e.preventDefault()
        this.updateZooming(e)
        this.clearCanvas()
    }

    initMouseHandlers() {
        this.canvas?.addEventListener("mousedown", this.mousedownHandler)
        this.canvas.addEventListener("mouseleave", this.mouseupHandler)
        this.canvas.addEventListener("wheel", this.mousewheelHandler, {passive: false})
        window.addEventListener("mouseup", this.mouseupHandler)
        this.canvas?.addEventListener("mouseup", this.mouseupHandler)
        this.canvas?.addEventListener("mousemove", this.mousemoveHandler)
    }
}