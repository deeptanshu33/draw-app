"use client"

import axios from "axios"
import { FormEvent, useRef } from "react"
import { BACKEND_URL } from "../config"
import { useRouter } from "next/navigation"

export function AuthPage({isSignin}: {
    isSignin: boolean
}){
    const router = useRouter()
    const emailRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const handleLogin = async (e:FormEvent) => {
        e.preventDefault();

        if(emailRef.current && passwordRef.current){
            try{
                await axios.post(`${BACKEND_URL}/signin`, {
                    "username": emailRef.current.value,
                    "password": passwordRef.current.value
                }, {
                    withCredentials: true
                })
                router.push('/home')
            }
            catch (err){
                console.log(err)
            }
        }
        
    }

    const handleSignup = async(e:FormEvent) => {
        e.preventDefault()

        if(emailRef.current && passwordRef.current && nameRef.current){
            try {
                const response  = await axios.post(`${BACKEND_URL}/signup`, {
                    "name": nameRef.current.value,
                    "username": emailRef.current.value,
                    "password": passwordRef.current.value
                })
                router.replace('/signin')
            } catch (error) {
                console.log(error)
            }
            
        }
    }

    return(
        <div className="flex justify-center items-center bg-gray-800 min-h-screen">
            <form onSubmit={isSignin ? handleLogin : handleSignup} className="p-6 m-2 bg-white rounded flex flex-col">
                {!isSignin && <input ref={nameRef} className="p-4" type="text" placeholder="Name"/>}
                <input ref={emailRef} className="p-4" type="text" placeholder="Email"/>
                <input ref={passwordRef} className="p-4" type="password" placeholder="Password"/>
                
                <button type="submit" className="bg-blue-400 p-4 rounded hover:cursor-pointer hover:bg-blue-200">{isSignin ? "Sign in" : "Sign up"}</button>
            </form>
        </div>
    )
}