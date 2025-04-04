import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface PageHeaderProps {
    title: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
  }

interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  buttonLabel, 
  onButtonClick 
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Get token from sessionStorage instead of localStorage
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        // Decode JWT token to get user data
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Decoded token:', decoded); // Log to see what's in the token
        setUserRole(decoded.role);
        setDebugInfo(`Role from token: "${decoded.role}"`);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setDebugInfo(`Error decoding token: ${error}`);
      }
    } else {
      setDebugInfo('No token found in sessionStorage');
    }
  }, []);

  // Check if user is secretary - case insensitive comparison
  const isSecretary = userRole?.toUpperCase() === 'SECRETARIO';
  
  return (
    <header className="flex flex-row justify-between items-center mb-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      
      {buttonLabel && isSecretary && (
        <button
          onClick={onButtonClick}
          className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                   bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                   text-white hover:text-blue-500 transition-colors"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </button>
      )}
    </header>
  );
};