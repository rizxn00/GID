'use client'

import { useState, ReactNode, memo, useEffect } from 'react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';

interface NavItemProps {
    icon: ReactNode
    children: ReactNode
    href?: string | object
    className?: ReactNode
    onClick?: () => void
}

interface UserProps {
    username:string
    email:string
}

const NavItem = memo(({ icon, children, href = '', className, onClick }: NavItemProps & { isSelected?: boolean }) => (
    <Link href={href} className="w-full">
        <div className={`flex justify-between hover:bg-surfaced z-50 rounded-md py-[5px] w-full px-4 transition-all cursor-pointer ${className}`}>
            <div onClick={onClick} className={`flex gap-2 items-center justify-start`}>
                {icon}
                <span>{children}</span>
            </div>
        </div>
    </Link>
));


NavItem.displayName = 'NavItem';

function disableDrawer() {
    const inputElement = document.getElementById('drawer-toggle') as HTMLInputElement
    if (inputElement) {
        inputElement.checked = false;
    }
}

const Navigation: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<UserProps>()

    const token = localStorage.getItem('token');

    const fetchDetails = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await axios.get(`${process.env.VERCEL_API_KEY}/api/auth/details`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          setData(response.data)
          setLoading(false);
        } catch (err) {
          toast.error('Failed to fetch details');
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const pathname = usePathname();


    const pages = [
        {
            'href': 'dashboard',
            'image': (<div>
                🏠
            </div>),
            'label': 'Home',
        },
        {
            'href': 'completed',
            'image': (<div>
                ✅
            </div>),
            'label': 'Completed',
        },
    ]

    const router = useRouter()

    const logout = () => {
        localStorage.clear()
        router.push('/login')
    }

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <aside className='relative h-screen overflow-y-hidden bg-surface transition-all hidden flex-col md:flex px-2 min-w-56'>
                <div className='mt-5 m-2 flex-1 space-y-2'>
                    <div className='flex gap-2 items-center'>
                    <Image width={8} height={8} className="h-8 w-8 rounded-full" src="https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon" alt="profile"/>
                    <div className='flex flex-col'>
                            <p className='text-text text-sm font-semibold'>{data?.username}</p>
                            <p className='text-second text-xs'>{data?.email}</p>
                        </div>
                    </div>
                    <hr className='bg-second text-surfaced' />
                    <div className='space-y-2'>
                        <ul className='flex flex-col items-start gap-2 transition-all'>
                            {pages.map((item: any) => {
                                const isSelected = pathname.includes(item.href);
                                return (
                                    <NavItem
                                        href={item.href}
                                        icon={item.image}
                                        key={item.label}
                                        isSelected={isSelected}
                                        className={isSelected ? 'bg-surfaced' : ''}
                                    >
                                        <p className='cursor-pointer select-none text-xs text-text'>{item.label}</p>
                                    </NavItem>
                                );
                            })}
                        </ul>
                        <div className={`flex gap-2 items-center justify-start mt-2`} onClick={logout}>
                                    <p>🚶</p>
                                    <p className='cursor-pointer select-none text-xs text-text'>Logout</p>
                                </div>
                    </div>
                </div>
            </aside>

            <div className="md:hidden">
                <div className="fixed top-0 left-0 right-0 z-40 p-3">
                    <input type="checkbox" id="drawer-toggle" className="sr-only peer" />
                    <label htmlFor="drawer-toggle" className="cursor-pointer w-9 h-9 bg-surfaced rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="text-text w-9 h-9" viewBox="0 0 24 24" fill="none">
                            <path d="M4 8.5L20 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 15.5L20 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </label>
                    <div className="fixed top-0 left-0 z-50 w-64 min-h-screen transition-transform duration-500 -translate-x-full bg-surface shadow-lg peer-checked:translate-x-0">
                        <div className="px-2 py-4 flex flex-col justify-between h-full">
                            <button onClick={disableDrawer} className="absolute top-4 right-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-text w-6 h-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M19.0005 4.99988L5.00045 18.9999M5.00045 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="mt-10 flex-1">
                                <ul className='flex flex-col items-start gap-2 transition-all'>
                                    {pages.map((item: any) => {
                                        const isSelected = pathname.includes(item.href);
                                        return (
                                            <NavItem
                                                href={item.href}
                                                icon={item.image}
                                                key={item.label}
                                                isSelected={isSelected}
                                                className={isSelected ? 'bg-surfaced' : ''}
                                            >
                                                <p className='cursor-pointer select-none text-xs text-text'>{item.label}</p>
                                            </NavItem>
                                        );
                                    })}
                                </ul>
                                <div className={`flex gap-2 items-center justify-start mt-2`} onClick={logout}>
                                    <p>🚶</p>
                                    <p className='cursor-pointer select-none text-xs text-text'>Logout</p>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navigation;
