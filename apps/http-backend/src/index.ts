import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import { authMiddleware } from './middleware'
import { CreateRoomSchema, SignInSchema, SignupSchema } from '@repo/common/types'
import { prismaClient } from "@repo/db/client"

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
    //get username password
    const parsedData = SignupSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.json({
            message: "Incorrect sign up inputs"
        })
        return;
    }

    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })

        res.json({
            userId: user.id
        })
    }
    catch(e) {
        console.log(e)
        res.status(411).json({
            message: "User with provided email already exists"
        })
    }


})

app.post('/signin', async (req, res) => {
    const data = SignInSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message: "Incorrect sign in inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: data.data.username,
            password: data.data.password
        }
    })
    
    if(!user){
        return res.status(403).json({
            message: "User not authorized"
        })
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({
        token
    })
})

app.post('/room', authMiddleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body)
    if (!parsedData.success) {
        return res.json({
            message: "Incorrect room inputs"
        })
    }

    const userId = req.userId

    try {
        const room = await prismaClient.room.create({
            data:{
                slug: parsedData.data.name,
                adminId: userId || ""
            }
        })
        return res.status(200).json({
            roomId: room.id
        })
    } catch (error){
        console.log(error)
        return res.status(500).json({
            "message": "something went wrong"
        })
    }
})

app.listen(3001)