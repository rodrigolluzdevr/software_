import { BiEdit } from 'react-icons/bi';
import { Region } from '@/types/region';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

interface RegionsTableProps {
  regions: Region[];
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (id: number) => void;
  formatDate: (date?: string) => string;
}

export const RegionsTable: React.FC<RegionsTableProps> = ({
  regions,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  formatDate,
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
    <div className="overflow-hidden rounded-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-light">
          <thead className="text-xs md:text-sm uppercase bg-white">
            <tr>
              <th
                scope="col"
                className="text-center p-2 md:p-4 w-4 hidden xl:table-cell"
              >
                <div className="inline-flex items-center">
                  ID
                  <button
                    onClick={() => onSort('id')}
                    className="ml-1 focus:outline-none"
                  >
                    {sortBy === 'id' ? (
                      sortOrder === 'asc' ? (
                        '▲'
                      ) : (
                        '▼'
                      )
                    ) : (
                      <span className="text-gray-300">▼</span>
                    )}
                  </button>
                </div>
              </th>
              <th scope="col" className="text-left p-2 md:p-4">
                <div className="inline-flex items-center">
                  Regiões
                  <button
                    onClick={() => onSort('name')}
                    className="ml-1 focus:outline-none"
                  >
                    {sortBy === 'name' ? (
                      sortOrder === 'asc' ? (
                        '▲'
                      ) : (
                        '▼'
                      )
                    ) : (
                      <span className="text-gray-300">▼</span>
                    )}
                  </button>
                </div>
              </th>
              <th
                scope="col"
                className="text-center p-2 md:p-4 hidden lg:table-cell"
              >
                Data De Criação
              </th>
              {isSecretary && (
                <th scope="col" className="text-center p-2 md:p-4 w-10 md:w-20">
                  Editar
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {regions.length === 0 ? (
              <tr className="bg-white">
                <td colSpan={isSecretary ? 4 : 3} className="text-center p-4">
                  Nenhuma região encontrada
                </td>
              </tr>
            ) : (
              regions.map(({ id, name, createdAt }) => (
                <tr key={id} className="bg-white hover:bg-gray-50">
                  <td className="text-center p-2 md:p-4 hidden xl:table-cell">
                    {id}
                  </td>
                  <td className="p-2 md:p-4">{name}</td>
                  <td className="text-center p-2 md:p-4 hidden lg:table-cell">
                    {formatDate(createdAt)}
                  </td>
                  {isSecretary && (
                    <td className="text-center p-2 md:p-4">
                      <button
                        onClick={() => onEdit(id)}
                        className="text-black hover:text-blue-500 transition-colors"
                        aria-label={`Editar região ${name}`}
                      >
                        <BiEdit className="text-xl md:text-2xl" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
