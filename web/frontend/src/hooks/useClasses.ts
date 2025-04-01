import { useEffect, useState } from "react";
import type { Class } from "@/types/class";

export const useClasses = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchClasses = async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem('token');
    
            // Verificar se o token existe
            if (!token) {
            throw new Error('Não autenticado - token não encontrado');
            }
    
            const response = await fetch('http://localhost:4000/classes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
    
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
    
            if (Array.isArray(data)) {
            setClasses(data);
            } else {
            throw new Error('API response is not an array');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            console.error('Erro ao buscar classes:', err);
        } finally {
            setIsLoading(false);
        }
        };
    
        fetchClasses();
    }, []);
    
    return { classes, isLoading, error };
    }