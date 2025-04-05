import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import StudentList from '@/components/users/students';
import withAuth from '@/pages/utils/withAuth';

const Students = () => {
  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <StudentList />
      </div>
    </Wrapper>
  );
};

export default withAuth(Students, ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR']);
