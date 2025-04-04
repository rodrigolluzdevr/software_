import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import StudentList from '@/components/users/students';

const Students = () => {
  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <StudentList />
      </div>
    </Wrapper>
  );
};

export default Students;
