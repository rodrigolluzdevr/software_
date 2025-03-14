import { NextRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

interface DirectorPanelProps {
  router: NextRouter;
}

const DirectorPanel = ({ router }: DirectorPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      <h2>Painel do Diretor</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/financeiro')}>
          Relatórios Financeiros
        </button>
      </div>
    </div>
  );
};

export default DirectorPanel;
