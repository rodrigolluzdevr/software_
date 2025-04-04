import DirectorsList from "@/components/users/directors";
import Wrapper from "@/components/wrapper/Wrapper";
import styles from '@/styles/Dashboard.module.css';


const Directors = () => {
  return (
    <Wrapper>
    <div className={styles.dashboardContainer}>
        <DirectorsList />
    </div>
    </Wrapper>
  );
}

export default Directors;