import { NextRouter } from 'next/router';
import { User } from '@/types/user';
import styles from '@/styles/Dashboard.module.css';

interface AdminPanelProps {
  users: User[];
  isLoading: boolean;
  onEditUser: (userId: number) => void;
  router: NextRouter;
}

const AdminPanel = ({ users, isLoading, onEditUser, router }: AdminPanelProps) => {
  return (
    <div className={styles.panelContainer}>
      {isLoading ? (
        <p>Carregando usuários...</p>
      ) : (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              {user.name} - {user.email}
              <button 
                className={styles.editButton}
                onClick={() => onEditUser(user.id)}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <h2>Administração</h2>
      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/dashboard/users')}>
          Gerenciar Usuários
        </button>
        <button onClick={() => router.push('/dashboard/reports')}>
          Relatórios
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
