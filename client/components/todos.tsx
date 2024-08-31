import React, { useState, useEffect, useRef } from 'react'
import ClickOutside from './clickOutside'
import axios from 'axios'
import { toast } from 'react-hot-toast';

interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

export default function Todos() {
    const [openTodoId, setOpenTodoId] = useState<string | null>(null)
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const [todo, setTodo] = useState<boolean>(false)
    const ref = useRef<HTMLInputElement | null>(null)
    const [todoTitle, setTodoTitle] = useState<string>('');

    const toggleTodoAdd = () => {
        setTodo(!todo);
    };

    useEffect(() => {
        fetchTodos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const token = localStorage.getItem('token');

    const createTodo = async () => {
        if (!todoTitle.trim()) {
            toast.error('Title is required');
          return;
        }
      
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos`, {
            title: todoTitle,
          }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
          });
      
          if (response.status === 201) {
            setTodoTitle('');
            setTodo(false);
            console.log(response)
            todos.push(response.data.data)
            toast.success('Todo added');
          }

        } catch (err) {
          console.error(err);
          toast.error('Failed to add todo')
        }
      };

    useEffect(() => {
        if (todo && ref.current) {
            ref.current.focus();
        }
    }, [todo]);

    const fetchTodos = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await axios.get<Todo[]>(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const todos = response.data.filter(done => done.completed !== true)
          setTodos(todos);
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
                await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos/${id}`, updatedTodo, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                // setTimeout(() => {
                    setTodos(todos.filter(todo => todo._id !== id))
                // }, 3000);
                toast.success('Todo updated');
            }
        } catch (err) {
            toast.error('Todo update failed');
        }
    }

    const deleteTodo = async (id: string) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setTodos(todos.filter(todo => todo._id !== id));
                toast.success('Todo deleted');
            }

        } catch (err) {
            console.error(err);
            toast.error('Failed to delete todo')
        }
    }

    const handleUpdateTodo = async (id: string): Promise<void> => {
        try {
            const updatedTodo = todos.find(todo => todo._id === id);
            if (updatedTodo && newTitle.trim()) {
                updatedTodo.title = newTitle;
                await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT }/api/todos/${id}`, { title: newTitle }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
                toast.success('Todo updated');
            }
            setEditingTodoId(null);
            setNewTitle('');
        } catch (err) {
            toast.error('Failed to update todo');
        }
    };

    const toggleOptions = (id: string) => {
        setOpenTodoId(openTodoId === id ? null : id);
    }

    const startEditing = (todo: Todo) => {
        setOpenTodoId(null)
        setEditingTodoId(todo._id);
        setNewTitle(todo.title);
    };
      
    if (loading) return <div>Loading...</div>

    return (
        <div>
            {/* create */}
            <div>{!todo ?
                <div className='bg-surface w-full flex gap-2 p-2 rounded-md border border-second border-dashed items-center cursor-pointer' onClick={toggleTodoAdd}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='fill-text w-6 h-auto'><path d="M450-450H250q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q237.25-510 250-510h200v-200q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-722.75 510-710v200h200q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q722.75-450 710-450H510v200q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.37-8.63Q450-237.25 450-250v-200Z" /></svg>
                    <p className='text-text text-sm'>New Todo</p>
                </div>
                :
                <div>
                    <ClickOutside onClick={() => setTodo(false)}>
                        <div className='bg-surface shadow-[rgba(17,_17,_26,_0.1)_0px_0px_6px] flex gap-2 w-full p-2 rounded-md border border-second items-center'>
                            <input
                                ref={ref}
                                type='text'
                                value={todoTitle}
                                onChange={(e) => setTodoTitle(e.target.value)}
                                className='text-text text-xs w-full outline-none px-1 bg-surface'
                            />
                            <button
                                onClick={createTodo}
                                className="bg-primary text-white px-2 py-1 rounded-md text-xs"
                            >
                                Create
                            </button>

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='fill-text w-6 h-auto' onClick={toggleTodoAdd}><path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z" /></svg>
                        </div>
                    </ClickOutside>
                </div>
            }</div>


            {/* view */}
            <div className='flex gap-2 items-center mt-5'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='fill-text w-6 h-auto'><path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92-6.23 2.31-13.46 2.31Z" /></svg>
                📋
                <p className='text-text text-sm'>Todos</p>
                <div className='rounded-md text-xs px-2 py-0.5 flex items-center bg-surface'>{todos.length}</div>
            </div>
            {todos.map(todo => (
                <div key={todo._id} className="px-9 flex justify-between mt-2">
                    <label htmlFor={`todo-${todo._id}`} className='flex items-center gap-2 text-sm'>
                        {editingTodoId === todo._id ? (
                            <div className='bg-surface shadow-[rgba(17,_17,_26,_0.1)_0px_0px_6px] flex gap-2 w-full p-2 rounded-md border border-second items-center'>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdateTodo(todo._id);
                                    }
                                }}
                                onBlur={() => handleUpdateTodo(todo._id)}
                                autoFocus
                                className='text-text text-xs w-full outline-none px-1 bg-surface' 
                                />
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </label>
                    <div className="flex gap-2">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => toggleOptions(todo._id)} viewBox="0 -960 960 960" className="fill-text w-6 h-auto">
                                <path d="M480-189.23q-24.75 0-42.37-17.63Q420-224.48 420-249.23q0-24.75 17.63-42.38 17.62-17.62 42.37-17.62 24.75 0 42.37 17.62Q540-273.98 540-249.23q0 24.75-17.63 42.37-17.62 17.63-42.37 17.63ZM480-420q-24.75 0-42.37-17.63Q420-455.25 420-480q0-24.75 17.63-42.37Q455.25-540 480-540q24.75 0 42.37 17.63Q540-504.75 540-480q0 24.75-17.63 42.37Q504.75-420 480-420Zm0-230.77q-24.75 0-42.37-17.62Q420-686.02 420-710.77q0-24.75 17.63-42.37 17.62-17.63 42.37-17.63 24.75 0 42.37 17.63Q540-735.52 540-710.77q0 24.75-17.63 42.38-17.62 17.62-42.37 17.62Z" />
                            </svg>
                            {openTodoId === todo._id &&
                                <ClickOutside onClick={() => setOpenTodoId(null)}>
                                    <div className="absolute right-16 z-10 mt-1 rounded-md bg-background py-1 shadow-lg border border-second focus:outline-none">
                                        <div className="block px-4 py-2 text-sm text-text hover:bg-surface cursor-pointer" onClick={() => startEditing(todo)}>📝 Edit</div>
                                        <div className="block px-4 py-2 text-sm text-text hover:bg-surface cursor-pointer" onClick={() => deleteTodo(todo._id)}>🗑️ Delete</div>
                                    </div>
                                </ClickOutside>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}