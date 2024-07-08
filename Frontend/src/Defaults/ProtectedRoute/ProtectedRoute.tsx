import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps)  {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchToken = async () => {
        const authToken = await getAuthToken();
        setToken(authToken);
        setIsLoading(false);
      };
  
      fetchToken();
    }, []);
  
    if (isLoading) {
      return <div>Loading...</div>; // Or any other loading indicator
    }
    
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
};