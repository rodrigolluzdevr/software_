import { useRouter } from 'next/router';
import Link from 'next/link';
import { BiEdit } from 'react-icons/bi';
import { useUsers } from '@/hooks/useUsers';

/**
 * StudentList component displays a table of student users (ROLE=USER) with navigation
 */
const StudentList = () => {
  const router = useRouter();
  const { users: allUsers = [], isLoading, error } = useUsers();
  
  // Filter users to only include those with ROLE="USER"
  const users = allUsers.filter(user => user.role === "USER");

  const handleRegisterClick = () => {
    router.push('/users/students/register');
  };

  const handleEditStudent = (userId: string | number) => {
    router.push(`/users/students/update/${userId}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  return (
    <section className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            {/* Header */}
            <header className="flex flex-row justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Lista De Alunos</h1>
              
              <button
                onClick={handleRegisterClick}
                className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                         bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                         text-white hover:text-blue-500 transition-colors"
                aria-label="Cadastrar novo aluno"
              >
                Cadastrar
              </button>
            </header>

            {/* Breadcrumbs */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ul className="flex items-center text-[14px] font-bold">
                <li className="hover:text-blue-500 transition-colors">
                  <Link href="/">Painel</Link>
                </li>
                <li className="mx-2" aria-hidden="true">/</li>
                <li className="text-blue-500" aria-current="page">Alunos</li>
              </ul>
            </nav>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4" aria-live="polite">
                <p>Carregando alunos...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-4 text-red-500" role="alert">
                <p>{error}</p>
              </div>
            )}

            {/* Students Table */}
            {!isLoading && !error && (
              <div className="overflow-hidden rounded-md shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-light">
                    <thead className="text-xs md:text-sm uppercase bg-white">
                      <tr>
                        <th scope="col" className="text-center p-2 md:p-4 w-4 hidden xl:table-cell">ID</th>
                        <th scope="col" className="text-left p-2 md:p-4">Aluno</th>
                        <th scope="col" className="text-center p-2 md:p-4 hidden sm:table-cell">Escola</th>
                        <th scope="col" className="text-center p-2 md:p-4 hidden md:table-cell">Turma</th>
                        <th scope="col" className="text-center p-2 md:p-4 hidden lg:table-cell">Data de Matrícula</th>
                        <th scope="col" className="text-center p-2 md:p-4 w-10 md:w-20">Editar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr className="bg-white">
                          <td colSpan={6} className="text-center p-4">Nenhum aluno encontrado</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="bg-white hover:bg-gray-50">
                            <td className="text-center p-2 md:p-4 hidden xl:table-cell">{user.id}</td>
                            <td className="p-2 md:p-4">{user.name}</td>
                            <td className="text-center p-2 md:p-4 hidden sm:table-cell">{user.organizationName || "Não informada"}</td>
                            <td className="text-center p-2 md:p-4 hidden md:table-cell">{user.classInfo || "Não informada"}</td>
                            <td className="text-center p-2 md:p-4 hidden lg:table-cell">{formatDate(user.createdAt)}</td>
                            <td className="text-center p-2 md:p-4">
                              <button 
                                onClick={() => handleEditStudent(user.id)}
                                className="text-black hover:text-blue-500 transition-colors"
                                aria-label={`Editar aluno ${user.name}`}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentList;