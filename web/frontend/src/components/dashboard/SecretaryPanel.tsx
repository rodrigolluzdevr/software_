import { NextRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

interface SecretaryPanelProps {
  router: NextRouter;
}

const SecretaryPanel = ({ router }: SecretaryPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      <h2>Painel do Secretário</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/matriculas')}>
          Gerenciar Matrículas
        </button>
      </div>
    </div>
  );
};

export default SecretaryPanel;
