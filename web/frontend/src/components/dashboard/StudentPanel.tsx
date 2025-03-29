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

interface StudentDashboardProps {
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

const StudentDashboard = ({ router }: StudentDashboardProps) => {
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
              <div className="bg-white rounded-md shadow-sm p-4 flex items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
