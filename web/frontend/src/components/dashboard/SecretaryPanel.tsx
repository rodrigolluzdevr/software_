import { NextRouter } from 'next/router';
import Link from 'next/link';
import { BiEdit } from 'react-icons/bi';

interface SecretaryPanelProps {
  router: NextRouter;
}

const SecretaryPanel = ({ router }: SecretaryPanelProps) => {
  // Função para navegação
  const navigateToRegister = () => router.push('/dashboard/alunos');
  
  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="py-4">
        {/* Cabeçalho com título e botão alinhados em todas as resoluções */}
        <div className="flex flex-row justify-between items-center mb-4">
          <h5 className="text-lg font-semibold">Lista De Alunos</h5>
          
          <button
            onClick={navigateToRegister}
            className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                     bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                     text-white hover:text-blue-500 transition-colors"
          >
            Cadastrar
          </button>
        </div>
        
        {/* Breadcrumb simplificado */}
        <div className="mb-6">
          <ul className="flex items-center text-[14px] font-bold">
            <li className="hover:text-blue-500 transition-colors">
              <Link href="/">Painel</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-blue-500">Alunos</li>
          </ul>
        </div>
        
        {/* Tabela responsiva */}
        <div className="overflow-hidden rounded-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-light">
              <thead className="text-xs md:text-sm uppercase bg-white">
                <tr>
                  {/* ID - menor prioridade */}
                  <th className="text-center p-2 md:p-4 w-4 hidden xl:table-cell">#</th>
                  {/* Aluno - maior prioridade */}
                  <th className="text-left p-2 md:p-4">Aluno</th>
                  {/* Escola - prioridade média-baixa */}
                  <th className="text-center p-2 md:p-4 hidden sm:table-cell">Escola</th>
                  {/* Turma - prioridade média */}
                  <th className="text-center p-2 md:p-4 hidden md:table-cell">Turma</th>
                  {/* Data - prioridade média-alta */}
                  <th className="text-center p-2 md:p-4 hidden lg:table-cell">Data de Matrícula</th>
                  {/* Editar - alta prioridade */}
                  <th className="text-center p-2 md:p-4 w-10 md:w-20">Editar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="text-center p-2 md:p-4 hidden xl:table-cell">1</td>
                  <td className="p-2 md:p-4">João Silva</td>
                  <td className="text-center p-2 md:p-4 hidden sm:table-cell">Escola Municipal Professor Barro Duro</td>
                  <td className="text-center p-2 md:p-4 hidden md:table-cell">2025 - 9 ºB Manhã</td>
                  <td className="text-center p-2 md:p-4 hidden lg:table-cell">01/03/2025</td>
                  <td className="text-center p-2 md:p-4">
                    <button className="text-black hover:text-blue-500 transition-colors">
                      <BiEdit className="text-xl md:text-2xl" />
                    </button>
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="text-center p-2 md:p-4 hidden xl:table-cell">2</td>
                  <td className="p-2 md:p-4">Maria Santos</td>
                  <td className="text-center p-2 md:p-4 hidden sm:table-cell">Barro Duro Municipal</td>
                  <td className="text-center p-2 md:p-4 hidden md:table-cell">2025 - 9 ºB Manhã</td>
                  <td className="text-center p-2 md:p-4 hidden lg:table-cell">05/03/2025</td>
                  <td className="text-center p-2 md:p-4">
                    <button className="text-black hover:text-blue-500 transition-colors">
                      <BiEdit className="text-xl md:text-2xl" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryPanel;