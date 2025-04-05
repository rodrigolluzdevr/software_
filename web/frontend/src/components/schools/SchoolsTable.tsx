import { BiEdit } from 'react-icons/bi';
import { School } from '@/types/school';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

interface SchoolsTableProps {
  schools: School[];
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (id: number) => void;
  formatDate: (date?: string) => string;
}

export const SchoolsTable: React.FC<SchoolsTableProps> = ({
  schools,
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

  // Check if user is secretary or coordinator
  const allowedRoles = ['COORDENADOR', 'SECRETARIO'];
  const hasPermission = userRole && allowedRoles.includes(userRole.toUpperCase());
  

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
                  Escolas
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
              {hasPermission && (
                <th scope="col" className="text-center p-2 md:p-4 w-10 md:w-20">
                  Editar
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {schools.length === 0 ? (
              <tr className="bg-white">
                <td colSpan={hasPermission ? 4 : 3} className="text-center p-4">
                  Nenhuma escola encontrada
                </td>
              </tr>
            ) : (
              schools.map(({ id, name, createdAt }) => (
                <tr key={id} className="bg-white hover:bg-gray-50">
                  <td className="text-center p-2 md:p-4 hidden xl:table-cell">
                    {id}
                  </td>
                  <td className="p-2 md:p-4">{name}</td>
                  <td className="text-center p-2 md:p-4 hidden lg:table-cell">
                    {formatDate(createdAt)}
                  </td>
                  {hasPermission && (
                    <td className="text-center p-2 md:p-4">
                      <button
                        onClick={() => onEdit(id)}
                        className="text-black hover:text-blue-500 transition-colors"
                        aria-label={`Editar escola ${name}`}
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
