import { NextRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BiUserPlus,
  BiBook,
  BiSolidSchool,
  BiUser,
  BiSliderAlt,
} from 'react-icons/bi';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import api from '../../services/api';

interface DirectorDashboardProps {
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

interface School {
  id: number;
  name: string;
  regionId: number;
}

export default function DirectorPanel({ router }: DirectorDashboardProps) {
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
  const [userSchools, setUserSchools] = useState<School[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');

  // Navegação
  const navigateToTeachers = () => router.push('/users/teachers/register');

  const navigateToStudents = () => router.push('/users/students/register');

  const navigateToClass = () => router.push('/users/class/register');

  const getUserInfo = () => {
    try {
      const userInfo = sessionStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  };

  const fetchDashboardData = async (schoolFilter?: string) => {
    setLoading(true);
    try {
      const endpoint = schoolFilter
        ? `/dashboard/stats?schoolId=${schoolFilter}`
        : '/dashboard/stats';

      const { data } = await api.get(endpoint);
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value;
    setSelectedSchoolId(schoolId);
    fetchDashboardData(schoolId);
  };

  useEffect(() => {
    const user = getUserInfo();
    if (user && user.schools) {
      setUserSchools(user.schools);
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            {/* Cabeçalho com título e filtro de escola */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h5 className="text-lg font-semibold">Dashboard Do Usuário</h5>

              {/* Filtro de escola */}
              {userSchools.length > 0 && (
                <div className="mt-2 sm:mt-0">
                  <select
                    value={selectedSchoolId}
                    onChange={handleSchoolChange}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Todas as escolas ({userSchools.length})
                    </option>
                    {userSchools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
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

            {/* Acesso rápido (exemplo) */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <div className="bg-white rounded-md shadow-sm p-4">
                <h6 className="font-semibold mb-4">Acesso Rápido</h6>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <button
                    onClick={navigateToTeachers}
                    className="flex flex-col-2 items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <BiUserPlus className="text-2xl text-blue-500 mb-1" />
                    <span className="text-sm ml-2">
                      Cadastrar Professores
                    </span>
                  </button>
                  <button
                    onClick={navigateToStudents}
                    className="flex flex-col-2 items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <BiUserPlus className="text-2xl text-blue-500 mb-1" />
                    <span className="text-sm ml-2">Cadastrar Alunos</span>
                  </button>
                  <button
                    onClick={navigateToClass}
                    className="flex flex-col-2 items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <BiUserPlus className="text-2xl text-blue-500 mb-1" />
                    <span className="text-sm ml-2">Cadastrar Turmas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
