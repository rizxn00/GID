'use client'

import { useEffect, useState } from 'react'
import Home from '../home'
import Todos from '@/components/todos';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import withAuth from '@/components/withAuth';

interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}


function Dashboard() {

    const [date, setDate] = useState<string>('')
    const username = localStorage.getItem('username')

    function getCurrentDateFormatted() {
        const date = new Date();

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate().toString().padStart(2, '0');
        const month = monthsOfYear[date.getMonth()];
        const year = date.getFullYear();

        setDate(`It's ${dayOfWeek}, ${dayOfMonth} ${month} ${year}`);
    }

    useEffect(() => {
        getCurrentDateFormatted()
    }, [])

    const refreshTodos = () => {
        fetchTodos();
    };

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2NiYWU5YTlmN2IzOGNkN2NkMjBjZCIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJpYXQiOjE3MjQ2OTMyNDQsImV4cCI6MTcyNTU1NzI0NH0.0SeJwWWoyaelTUThZHIwExdDjQK4qoTlI9xX7e0PNXs';
    
    const fetchTodos = async (): Promise<void> => {
        try {
            if (!token) throw new Error('No token found');
            
            const response = await axios.get<Todo[]>(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (err) {
            toast.error('Failed to fetch todos');
            console.error(err);
        }
    };


    return (
        <Home className='space-y-5'>
            <div>
                <div className='space-x-1'>
                    <p className='text-text font-semibold text-xl'>Hi, {username}</p>
                    <p className='text-second text-xs'>{date}</p>
                </div>

            </div>
            <div>
                <Todos />
            </div>
        </Home>
    )
}


export default withAuth(Dashboard)
