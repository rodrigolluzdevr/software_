import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import ClassesList from '@/components/school-classes';

const Classes = () => {
  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <ClassesList />
      </div>
    </Wrapper>
  );
};

export default Classes;
