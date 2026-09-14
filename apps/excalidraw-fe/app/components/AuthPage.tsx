"use client"

import axios from "axios"
import { FormEvent, useRef, useState } from "react"
import { BACKEND_URL } from "../config"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const router = useRouter()
    const emailRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (emailRef.current && passwordRef.current) {
            try {
                await axios.post(
                    `${BACKEND_URL}/signin`,
                    {
                        username: emailRef.current.value,
                        password: passwordRef.current.value,
                    },
                    { withCredentials: true }
                )
                router.push("/home")
            } catch (err) {
                console.log(err)
                setError("Invalid email or password. Please try again.")
            } finally {
                setLoading(false)
            }
        }
    }

    const handleSignup = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (emailRef.current && passwordRef.current && nameRef.current) {
            try {
                await axios.post(`${BACKEND_URL}/signup`, {
                    name: nameRef.current.value,
                    username: emailRef.current.value,
                    password: passwordRef.current.value,
                })
                router.replace("/signin")
            } catch (err) {
                console.log(err)
                setError("An account with this email already exists.")
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: "var(--bg-primary)" }}
        >
            {/* Ambient glow */}
            <div
                className="pointer-events-none fixed inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 50% at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--accent-gradient)" }}
                    >
                        <Pencil size={18} className="text-white" />
                    </div>
                    <span
                        className="text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        DrawBoard
                    </span>
                </div>

                {/* Card */}
                <div className="glass-card p-8">
                    <h2
                        className="text-2xl font-bold text-center mb-1"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {isSignin ? "Welcome back" : "Create your account"}
                    </h2>
                    <p
                        className="text-center text-sm mb-8"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {isSignin
                            ? "Sign in to continue to your boards"
                            : "Get started with your free account"}
                    </p>

                    {error && (
                        <div
                            className="mb-5 p-3 rounded-lg text-sm text-center"
                            style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.25)",
                                color: "#f87171",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={isSignin ? handleLogin : handleSignup}
                        className="flex flex-col gap-4"
                    >
                        {!isSignin && (
                            <div className="relative">
                                <User
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2"
                                    style={{ color: "var(--text-muted)" }}
                                />
                                <input
                                    ref={nameRef}
                                    className="input-field"
                                    style={{ paddingLeft: 48 }}
                                    type="text"
                                    placeholder="Full name"
                                    required
                                />
                            </div>
                        )}
                        <div className="relative">
                            <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: "var(--text-muted)" }}
                            />
                            <input
                                ref={emailRef}
                                className="input-field"
                                style={{ paddingLeft: 48 }}
                                type="text"
                                placeholder="Email address"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                style={{ color: "var(--text-muted)" }}
                            />
                            <input
                                ref={passwordRef}
                                className="input-field"
                                style={{ paddingLeft: 48 }}
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isSignin ? "Sign In" : "Create Account"}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <p
                        className="text-center text-sm mt-6"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <Link
                            href={isSignin ? "/signup" : "/signin"}
                            className="font-medium no-underline"
                            style={{ color: "var(--accent-from)" }}
                        >
                            {isSignin ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}