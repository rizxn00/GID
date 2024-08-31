'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function Login() {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const router = useRouter()

    const handleSubmit = async(e: any) => {
        e.preventDefault()

        if(!email || !password){
            toast.error('Please enter all the fields')

        }
        const payload = {
            'email':email,
            'password':password
        }

        try {
            const response:any = await axios.post(`${process.env.VERCEL_API_KEY}/api/auth/login`, payload)
            
            console.log(response)

            if (response.status === 200) {
                toast.success('Login Successfull')
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('username', response.data.user.username)
                setTimeout(() => {
                    router.push('dashboard')
                }, 2000);
            }
        } catch (error: any) {
            console.error(error)
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    }
    return (
        <div className="bg-background text-text flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
            <div className="relative mt-12 w-full max-w-lg sm:mt-10">
                <div className="mx-5 border bg-surface border-b-surfaced/20 sm:border-t-surface shadow-[20px_0_20px_20px] shadow-surface/10 dark:shadow-surfaced/20 rounded-lg border-surfaced/20 border-l-surfaced/20 border-r-surfaced/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                    <div className="flex flex-col p-6">
                        <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3>
                        <p className="mt-1.5 text-sm font-medium text-text/50">Welcome back, enter your credentials to continue.
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        <form onSubmit={handleSubmit}>
                            <div className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                <div className="flex justify-between">
                                    <label className="text-xs font-medium  group-focus-within:text-text text-text">Email</label>
                                </div>
                                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 sm:leading-7 text-text" />
                            </div>
                            <div className="mt-4">
                                <div className="group relative rounded-lg border focus-within:border-second px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-second/30">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-medium  group-focus-within:text-text text-text">Password</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-text" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-x-2">
                                <a className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200" href="/register">Register</a>
                                <button type="submit" className="font-semibold bg-primary hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 text-white h-10 px-4 py-2">Log in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
