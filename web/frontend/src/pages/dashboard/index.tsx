import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserRole } from '@/types/auth';

import withAuth from '../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';

import AdminPanel from '@/components/dashboard/AdminPanel';
import SecretaryPanel from '@/components/dashboard/SecretaryPanel';
import CoordinatorPanel from '@/components/dashboard/CoordinatorPanel';
import DirectorPanel from '@/components/dashboard/DirectorPanel';
import StudentPanel from '@/components/dashboard/StudentPanel';
import TeacherPanel from '@/components/dashboard/TeacherPanel';

const Dashboard = () => {
  const router = useRouter();

  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role') as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        {role === 'ADMIN' && <AdminPanel />}
        {role === 'PROFESSOR' && <TeacherPanel router={router} />}
        {(role === 'SECRETARIO' || null) && <SecretaryPanel router={router} />}
        {role === 'COORDENADOR' && <CoordinatorPanel router={router} />}
        {role === 'DIRETOR' && <DirectorPanel router={router} />}
        {role === 'USER' && <StudentPanel router={router} />}
      </div>
    </Wrapper>
  );
};

//export default withAuth(Dashboard);
export default Dashboard;
