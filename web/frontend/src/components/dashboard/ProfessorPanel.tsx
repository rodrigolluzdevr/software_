import { NextRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

interface ProfessorPanelProps {
  router: NextRouter;
}

const ProfessorPanel = ({ router }: ProfessorPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      <h2>Painel do Professor</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/alunos')}>
          Ver Alunos
        </button>
        <button onClick={() => router.push('/dashboard/notas')}>
          Lançar Notas
        </button>
      </div>
    </div>
  );
};

export default ProfessorPanel;
