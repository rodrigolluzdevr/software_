import { BiEdit } from 'react-icons/bi';
import type { Class } from '@/types/class';


interface ClassesTableProps {
  classes: Class[];
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onEdit: (id: number) => void;
  formatDate: (date?: string) => string;
}

export const ClassesTable: React.FC<ClassesTableProps> = ({
  classes,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  formatDate,
}) => (
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
                Turmas
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
            <th scope="col" className="text-center p-2 md:p-4 w-10 md:w-20">
              Editar
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr className="bg-white">
              <td colSpan={6} className="text-center p-4">
                Nenhuma turma encontrada
              </td>
            </tr>
          ) : (
            classes.map(({ id, name, createdAt }) => (
              <tr key={id} className="bg-white hover:bg-gray-50">
                <td className="text-center p-2 md:p-4 hidden xl:table-cell">
                  {id}
                </td>
                <td className="p-2 md:p-4">{name}</td>
                <td className="text-center p-2 md:p-4 hidden lg:table-cell">
                  {formatDate(createdAt)}
                </td>
                <td className="text-center p-2 md:p-4">
                  <button
                    onClick={() => onEdit(id)}
                    className="text-black hover:text-blue-500 transition-colors"
                    aria-label={`Editar região ${name}`}
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
