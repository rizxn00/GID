'use client'

import Navigation from '@/components/navigation'
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type Props = {
    children: React.ReactNode
    className?: string
}

export default function Home({ children, className }: Props) {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(event.target.value);
    };
    return (
        <div className={`flex flex-col md:flex-row min-h-screen h-screen overflow-hidden`}>
            <Navigation />
            <main className={`flex-1 overflow-auto p-5 pt-20 md:pt-5 ${className}`}>
                {children}
            </main>
            <div className='fixed bottom-5 right-5'>
                <div className="inline-flex items-center rounded-md border border-second bg-background p-1 shadow-sm">
                    <label className={`flex items-center space-x-2 rounded px-3 py-1.5 text-sm font-medium text-text ${theme === 'light' && 'bg-surface'}`}>
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span>
                            <input type="radio" name="theme" id="light" value="light" className="hidden peer" checked={theme === "light"} onChange={handleThemeChange} />
                            Light
                        </span>
                    </label>
                    <label className={`flex items-center space-x-2 rounded px-3 py-1.5 text-sm font-medium text-text ${theme === 'dark' && 'bg-surface'}`}>
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                        <span><input type="radio" name="theme" id="dark" value="dark" className="hidden peer" checked={theme === "dark"} onChange={handleThemeChange} />
                            Dark
                        </span>
                    </label>
                </div>
            </div>
        </div>
    )
}
