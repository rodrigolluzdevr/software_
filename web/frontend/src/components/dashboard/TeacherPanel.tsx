import { NextRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  BiBook,
} from 'react-icons/bi';
import { FaUserGraduate } from 'react-icons/fa';
import api from '../../services/api';

interface TeacherDashboardProps {
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

interface ClassData {
  id: number;
  name: string;
  schoolId: number;
}

export default function TeacherPanel({ router }: TeacherDashboardProps) {
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
  const [userClasses, setUserClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Obter payload do usuário a partir do sessionStorage (ou localStorage)
  const getUserInfo = () => {
    try {
      const userInfo = sessionStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      return null;
    }
  };

  const fetchDashboardData = async (classFilter?: string) => {
    setLoading(true);
    try {
      const endpoint = classFilter
        ? `/dashboard/stats?classId=${classFilter}`
        : '/dashboard/stats';
      const { data } = await api.get(endpoint);
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    fetchDashboardData(classId);
  };

  useEffect(() => {
    const user = getUserInfo();
    if (user && user.classes) {
      setUserClasses(user.classes);
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      {/* Opção de filtrar por classe */}
      {userClasses.length > 0 && (
        <div className="mt-2 mb-4">
          <select
            value={selectedClassId}
            onChange={handleClassChange}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as Classes ({userClasses.length})</option>
            {userClasses.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      {/* Exemplo adicional de métricas semelhantes às do diretor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      </div>
    </div>
  );
}
