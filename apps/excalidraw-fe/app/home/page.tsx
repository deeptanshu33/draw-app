import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Dashboard } from "./dashboard"

export default async function Home(){
    const token = (await cookies()).get('access_token')
    if(!token) redirect('/signin')
    return(
        <Dashboard />
    )
}