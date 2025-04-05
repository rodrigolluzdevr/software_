import DirectorsList from "@/components/users/directors";
import Wrapper from "@/components/wrapper/Wrapper";
import withAuth from "@/pages/utils/withAuth";
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


export default withAuth(Directors, ['SECRETARIO', 'COORDENADOR']);