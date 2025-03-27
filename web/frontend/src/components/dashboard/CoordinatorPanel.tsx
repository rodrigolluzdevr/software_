import { NextRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BiUserPlus, BiBook, BiSolidSchool, BiUser, BiSliderAlt } from 'react-icons/bi';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import api from '../../services/api';

interface CoordinatorDashboardProps {
  router: NextRouter;
}

interface DashboardStats {
  regions: number;
  schools: number;
  coordinators: number;
  directors: number;
  classes: number;
  teachers: number;
  students: number;
}

interface Region {
  id: number;
  name: string;
  organizationId: number;
}

const CoordinatorDashboard = ({ router }: CoordinatorDashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    regions: 0,
    schools: 0,
    coordinators: 0,
    directors: 0,
    classes: 0,
    teachers: 0,
    students: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [userRegions, setUserRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');

  // Funções de navegação
  const navigateToDirectors = () => router.push('/users/directors/register');

  // Obter informações do usuário/coordenador do localStorage
  const getUserInfo = () => {
    try {
      const userInfo = sessionStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  };

  // Função para buscar os dados com base na seleção de região ou todas as regiões
  const fetchDashboardData = async (regionFilter?: string) => {
    setLoading(true);
    try {
      // Adicionar filtro de região se especificado
      const endpoint = regionFilter 
        ? `/dashboard/stats?regionId=${regionFilter}` 
        : '/dashboard/stats';
      
      const { data } = await api.get(endpoint);
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para mudança de região selecionada
  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = event.target.value;
    setSelectedRegionId(regionId);
    fetchDashboardData(regionId);
  };

  useEffect(() => {
    // Buscar informações do usuário e configurar regiões
    const user = getUserInfo();
    if (user && user.regions) {
      setUserRegions(user.regions);
    }

    // Carregar dados iniciais (todas as regiões)
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            {/* Cabeçalho com título e filtro de região */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h5 className="text-lg font-semibold">Dashboard Do Coordenador</h5>
              
              {/* Filtro de região */}
              {userRegions.length > 0 && (
                <div className="mt-2 sm:mt-0">
                  <select
                    value={selectedRegionId}
                    onChange={handleRegionChange}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas as regiões ({userRegions.length})</option>
                    {userRegions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Breadcrumb simplificado */}
            <div className="mb-6">
              <ul className="flex items-center text-[14px] font-bold">
                <li className="hover:text-blue-500 transition-colors">
                  <Link href="/">Início</Link>
                </li>
                <li className="mx-2">/</li>
                <li className="text-blue-500">Dashboard</li>
              </ul>
            </div>

            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiSliderAlt className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Regiões</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.regions}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiSolidSchool className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Escolas</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.schools}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiUser className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Diretores</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.directors}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BiBook className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Turmas</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.classes}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaChalkboardTeacher className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Professores</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.teachers}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-md shadow-sm p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserGraduate className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Alunos</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.students}
                  </h4>
                </div>
              </div>
            </div>

            {/* Cards de acesso rápido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-md shadow-sm p-4">
                <h6 className="font-semibold mb-4">Acesso Rápido</h6>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  <button
                    onClick={navigateToDirectors}
                    className="flex flex-col-2 items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <BiUserPlus className="text-2xl text-blue-500 mb-1" />
                    <span className="text-sm ml-2">Cadastrar Diretores</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;