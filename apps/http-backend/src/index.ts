import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'
import { authMiddleware } from './middleware'
import { CreateRoomSchema, SignInSchema, SignupSchema } from '@repo/common/types'

const app = express()

app.post('/signup', (req, res) => {
    //get username password
    const data = SignupSchema.safeParse(req.body)
    if(!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const username = req.body.get('username')
    const password = req.body.get('password')


})

app.post('/signin', (req, res) => {
    const username = req.body.get('username')
    const password = req.body.get('password')

    const data = SignInSchema.safeParse(req.body)
    if(!data.success){
        res.json({
            message: "Incorrect inputs"
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
    if(!data.success){
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const username = req.body.get('username')
    const password = req.body.get('password')
})

app.listen(3001)