'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import Home from '../home';
import withAuth from '@/components/withAuth';


interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

function Completed() {

    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState<boolean>(true)

   

    const [date, setDate] = useState<string>('')

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
        fetchTodos()
        getCurrentDateFormatted()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const token = localStorage.getItem('token');

    const fetchTodos = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await axios.get<Todo[]>(`${process.env.VERCEL_API_KEY}/api/todos/completed`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          setTodos(response.data);
          setLoading(false);
        } catch (err) {
          toast.error('Failed to fetch todos');
          setLoading(false);
        }
      };

    const toggleTodo = async (id: string): Promise<void> => {
        try {
            const updatedTodo = todos.find(todo => todo._id === id)
            if (updatedTodo) {
                updatedTodo.completed = !updatedTodo.completed
                await axios.put(`${process.env.VERCEL_API_KEY}/api/todos/${id}`, updatedTodo, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                setTodos(todos.filter(todo => todo._id !== id))
                toast.success('Todo updated');
            }
        } catch (err) {
            toast.error('Todo update failed');
        }
    }
      
    if (loading) return <div><Home>Loading...</Home></div>

    return (
        <Home className='space-y-5'>
        <div>
            <div className='space-x-1'>
                <p className='text-text font-semibold text-xl'>Hi, {localStorage.getItem('username')}</p>
                <p className='text-second text-xs'>{date}</p>
            </div>

        </div>
        <div>
            <div className='flex gap-2 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='fill-text w-6 h-auto'><path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92-6.23 2.31-13.46 2.31Z" /></svg>
                ✅
                <p className='text-text text-sm'>Completed Todos</p>
                <div className='rounded-md text-xs px-2 py-0.5 flex items-center bg-surface'>{todos.length}</div>
            </div>
            {todos.map(todo => (
                <div key={todo._id} className="px-9 flex justify-between mt-2">
                    <label htmlFor={`todo-${todo._id}`} className='flex items-center gap-2 text-sm'>
                       
                                <span className="h-5 w-5 inline-block rounded-md border-2 border-text peer-checked:bg-black items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id={`todo-${todo._id}`}
                                        className="hidden peer"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo._id)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-text hidden peer-checked:block">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </span>
                                <span className={todo.completed ? 'line-through text-second' : ''}>{todo.title}</span>
                    </label>
                </div>
            ))}
        </div>
        </Home>
    )
}


export default withAuth(Completed)