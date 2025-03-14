import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = (
  Component: React.ComponentType<WithAuthProps>,
  allowedRoles: string[] = [],
) => {
  const Wrapper = (props: WithAuthProps) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuth = () => {
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);
      };

      checkAuth();
      window.addEventListener('storage', checkAuth);
      return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
      if (isAuthenticated === false && !['/login', '/'].includes(router.pathname)) {
        alert('Você precisa estar logado para acessar esta página.');
        router.replace('/login');
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
      return null;
    }

    if (isAuthenticated === false && !['/login', '/'].includes(router.pathname)) {
      return null;
    }

    const userRole = sessionStorage.getItem('role');
    if (allowedRoles.length && !allowedRoles.includes(userRole || '')) {
      alert('Você não tem permissão para acessar esta página.');
      router.replace('/login');
      return null;
    }

    return <Component {...props} />;
  };

  return Wrapper;
};

export default withAuth;
