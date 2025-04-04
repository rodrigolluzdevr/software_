import { BiEdit } from "react-icons/bi";
import type { User } from "@/types/user";


interface StudentsTableProps {
  students: User[];
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (id: string | number) => void;
  formatDate: (date?: string) => string;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  formatDate
}) => (
  <div className="overflow-hidden rounded-md shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left font-light">
        <thead className="text-xs md:text-sm uppercase bg-white">
          <tr>
            <th scope="col" className="text-center p-2 md:p-4 w-4 hidden xl:table-cell">
              <div className="inline-flex items-center">
                ID
                <button onClick={() => onSort('id')} className="ml-1 focus:outline-none">
                  {sortBy === 'id' ? (sortOrder === 'asc' ? '▲' : '▼') : <span className="text-gray-300">▼</span>}
                </button>
              </div>
            </th>
            <th scope="col" className="text-left p-2 md:p-4">
              <div className="inline-flex items-center">
                Nome
                <button onClick={() => onSort('name')} className="ml-1 focus:outline-none">
                  {sortBy === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : <span className="text-gray-300">▼</span>}
                </button>
              </div>
            </th>
            <th scope="col" className="text-left p-2 md:p-4 hidden lg:table-cell">
              E-mail
            </th>
            <th scope="col" className="text-center p-2 md:p-4 hidden lg:table-cell">
              Data De Criação
            </th>
            <th scope="col" className="text-center p-2 md:p-4 w-10 md:w-20">
              Editar
            </th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr className="bg-white">
              <td colSpan={6} className="text-center p-4">
                Nenhum estudante encontrado
              </td>
            </tr>
          ) : (
            students.map(({
              id,
              name,
              email,
              createdAt
            }) => (
              <tr key={id} className="bg-white hover:bg-gray-50">
                <td className="text-center p-2 md:p-4 hidden xl:table-cell">{id}</td>
                <td className="p-2 md:p-4">{name}</td>
                <td className="p-2 md:p-4 hidden lg:table-cell">{email}</td>
                <td className="text-center p-2 md:p-4 hidden lg:table-cell">{formatDate(createdAt)}</td>
                <td className="text-center p-2 md:p-4">
                  <button
                    onClick={() => onEdit(id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    aria-label={`Editar coordenador ${name}`}
                  >
                    <BiEdit className="text-xl md:text-2xl" />
                  </button>
                </td>
              </tr>
            ))
            )}
        </tbody>
      </table>
    </div>
  </div>
);
