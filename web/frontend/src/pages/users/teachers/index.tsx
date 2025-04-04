
import TeachersList from "@/components/users/teachers";
import Wrapper from "@/components/wrapper/Wrapper";
import styles from '@/styles/Dashboard.module.css';


const Teachers = () => {
  return (
    <Wrapper>
    <div className={styles.dashboardContainer}>
        <TeachersList />
    </div>
    </Wrapper>
  );
}

export default Teachers;