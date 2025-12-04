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

app.post('/signin', (req, res) => {
    const username = req.body.get('username')
    const password = req.body.get('password')

    const data = SignInSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message: "Incorrect sign in inputs"
        })
        return;
    }

    const userId = 1
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token
    })
})

app.post('/room', authMiddleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body)
    if (!data.success) {
        res.json({
            message: "Incorrect room inputs"
        })
        return;
    }

    const username = req.body.get('username')
    const password = req.body.get('password')
})

app.listen(3001)