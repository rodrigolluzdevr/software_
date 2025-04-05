import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          // Decode the token to get user role
          const decoded = jwtDecode<JwtPayload>(token);
          setUserRole(decoded.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to decode token:', error);
          setIsAuthenticated(false);
          sessionStorage.removeItem('token'); // Clear invalid token
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
      window.addEventListener('storage', checkAuth);
      return () => window.removeEventListener('storage', checkAuth);
    }, []);

    useEffect(() => {
      if (isLoading) return;

      // Handle unauthenticated users
      if (isAuthenticated === false && !['/login', '/'].includes(router.pathname)) {
        console.log('Redirecionando para login: Usuário não autenticado');
        router.replace('/login');
        return;
      }

      // Check role-based access
      if (isAuthenticated && allowedRoles.length > 0 && userRole) {
        const userRoleUpper = userRole.toUpperCase();
        const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
        
        if (!allowedRolesUpper.includes(userRoleUpper)) {
          router.replace('/unauthorized');
          return;
        }
      }
    }, [isAuthenticated, userRole, router, isLoading]);

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Don't render protected pages for unauthenticated users
    if (isAuthenticated === false && !['/login', '/'].includes(router.pathname)) {
      return null;
    }

    // Don't render protected pages for unauthorized users
    if (isAuthenticated && allowedRoles.length > 0 && userRole) {
      const userRoleUpper = userRole.toUpperCase();
      const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
      
      if (!allowedRolesUpper.includes(userRoleUpper)) {
        return null;
      }
    }

    return <Component {...props} />;
  };

  // DisplayName for React DevTools
  const componentName = Component.displayName || Component.name || 'Component';
  Wrapper.displayName = `withAuth(${componentName})`;

  return Wrapper;
};

export default withAuth;