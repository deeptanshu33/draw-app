"use client"
export function AuthPage({isSignin}: {
    isSignin: boolean
}){
    return(
        <div className="flex justify-center items-center bg-gray-800 min-h-screen">
            <div className="p-6 m-2 bg-white rounded flex flex-col">
                <input className="p-4" type="text" placeholder="Email"/>
                <input className="p-4" type="password" placeholder="Password"/>

                <button className="bg-blue-400 p-4 rounded hover:cursor-pointer hover:bg-blue-200" onClick={()=>{
                    
                }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    )
}