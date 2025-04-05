import Wrapper from '@/components/wrapper/Wrapper';
import styles from '@/styles/Dashboard.module.css';
import RegionsList from '@/components/regions';
import withAuth from '../utils/withAuth';

const Regions = () => {
  return (
    <Wrapper>
      <div className={styles.dashboardContainer}>
        <RegionsList />
      </div>
    </Wrapper>
  );
};

export default withAuth(Regions, ['SECRETARIO', 'COORDENADOR']);
