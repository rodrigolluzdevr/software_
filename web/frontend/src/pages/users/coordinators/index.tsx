import CoordinatorsList from "@/components/users/coordinators";
import Wrapper from "@/components/wrapper/Wrapper";
import styles from '@/styles/Dashboard.module.css';


const Coordinators = () => {
  return (
    <Wrapper>
    <div className={styles.dashboardContainer}>
        <CoordinatorsList />
    </div>
    </Wrapper>
  );
}

export default Coordinators;