import StudentRegister from '@/components/users/student/StudentRegister';
import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';

const Students = () => {
  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <StudentRegister />
      </div>
    </Wrapper>
  );
};

export default Students;
