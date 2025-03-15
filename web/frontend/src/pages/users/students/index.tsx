import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import { UserRole } from '@/types/auth';
import { User } from '@/types/user';
import { useUsers } from '@/hooks/useUsers';
import StudentList from '@/components/users/student/Student';

const Students = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const { users, isLoading, error } = useUsers();

  const handleEditUser = (userId: number) => {
    router.push(`/update/UpdateUser?userId=${userId}`);
  };

  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <StudentList 
          router={router} 
        />
      </div>
    </Wrapper>
  );
};

export default Students;