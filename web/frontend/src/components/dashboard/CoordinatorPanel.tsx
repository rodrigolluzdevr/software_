import { NextRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

interface CoordinatorPanelProps {
  router: NextRouter;
}

const CoordinatorPanel = ({ router }: CoordinatorPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      <h2>Painel do Coordenador</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/planejamento')}>
          Planejamento Escolar
        </button>
      </div>
    </div>
  );
};

export default CoordinatorPanel;
