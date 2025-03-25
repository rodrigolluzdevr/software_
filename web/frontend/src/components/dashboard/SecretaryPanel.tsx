import { NextRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BiUserPlus,
  BiBook,
  BiSolidSchool,
  BiSliderAlt,
  BiUser,
} from 'react-icons/bi';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import api from '../../services/api';

interface SecretaryDashboardProps {
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

const SecretaryDashboard = ({ router }: SecretaryDashboardProps) => {
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

  // Funções de navegação
  const navigateToCoordinators = () =>
    router.push('/users/coordinators/register');
  const navigateToDirectors = () => router.push('/users/directors/register');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            {/* Cabeçalho com título */}
            <div className="flex flex-row justify-between items-center mb-4">
              <h5 className="text-lg font-semibold">Dashboard Do Usuário</h5>
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
                  <p className="text-gray-500 text-sm">Coordenadores</p>
                  <h4 className="font-semibold text-lg">
                    {loading ? '...' : stats.coordinators}
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
                    onClick={navigateToCoordinators}
                    className="flex flex-col-2 items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <BiUserPlus className="text-2xl text-blue-500 mb-1" />
                    <span className="text-sm ml-2">
                      Cadastrar Coordenadores
                    </span>
                  </button>
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

export default SecretaryDashboard;
