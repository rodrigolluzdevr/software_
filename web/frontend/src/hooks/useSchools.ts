import { useState, useEffect} from 'react';
import type { School } from '@/types/school';

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem('token');

        // Verificar se o token existe
        if (!token) {
          throw new Error('Não autenticado - token não encontrado');
        }

        const response = await fetch('http://localhost:4000/schools', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setSchools(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Erro ao buscar escolas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return { schools, isLoading, error };
};
