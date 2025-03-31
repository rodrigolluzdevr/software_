import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import { UserRole } from '@/types/auth';
import { useUsers } from '@/hooks/useUsers';
import AdminPanel from '@/components/dashboard/AdminPanel';
import SecretaryPanel from '@/components/dashboard/SecretaryPanel';
import CoordinatorPanel from '@/components/dashboard/CoordinatorPanel';
import DirectorPanel from '@/components/dashboard/DirectorPanel';
import StudentPanel from '@/components/dashboard/StudentPanel';
import TeacherPanel from '@/components/dashboard/TeacherPanel';

const Dashboard = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const { users, isLoading, error } = useUsers();

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role') as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleEditUser = (userId: number) => {
    router.push(`/update/UpdateUser?userId=${userId}`);
  };

  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>   
        {role === 'ADMIN' && (
          <AdminPanel 
            users={users} 
            isLoading={isLoading}
            onEditUser={handleEditUser} 
            router={router} 
          />
        )}

        {role === 'PROFESSOR' && <TeacherPanel router={router} />}
        {role === 'SECRETARIO' && <SecretaryPanel router={router} />}
        {role === 'COORDENADOR' && <CoordinatorPanel router={router} />}
        {role === 'DIRETOR' && <DirectorPanel router={router} />}
        {role === 'USER' && <StudentPanel router={router} />}
      </div>
    </Wrapper>
  );
};

export default Dashboard; //withAuth(Dashboard);
