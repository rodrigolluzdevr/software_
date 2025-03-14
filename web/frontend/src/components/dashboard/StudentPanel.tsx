import { NextRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

interface StudentPanelProps {
  router: NextRouter;
}

const StudentPanel = ({ router }: StudentPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      <h2>Área do Aluno</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/boletim')}>
          Ver Boletim
        </button>
      </div>
    </div>
  );
};

export default StudentPanel;
