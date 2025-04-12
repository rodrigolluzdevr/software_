import Wrapper from "@/components/wrapper/Wrapper"
import styles from '@/styles/Dashboard.module.css';
import SchoolsList from "@/components/schools";
import withAuth from "../utils/withAuth";

const Schools = () => {
  return (
    <Wrapper> 
      <div className={styles.dashboardContainer}>
        <SchoolsList/>
      </div>
    </Wrapper>
  );
};

export default withAuth(Schools, ['SECRETARIO', 'COORDENADOR', 'DIRETOR', 'PROFESSOR']);
