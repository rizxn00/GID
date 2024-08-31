import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Home from '@/app/home';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        router.push('login');
      } else {
        setIsLoading(false);
      }
    }, [router]);


    if (isLoading) {
      return  <div className='h-screen'><Home>Loading...</Home></div>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;