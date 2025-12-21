export function screenToWorldCoordinates(screenX:number, screenY:number, vX:number, vY: number, vScale: number){
    const wX = (screenX - vX)/vScale
    const wY = (screenY - vY)/vScale

    return {
        worldX: wX,
        worldY: wY
    }
}