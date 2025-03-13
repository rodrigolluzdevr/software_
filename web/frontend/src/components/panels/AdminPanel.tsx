import React from "react";
import { useRouter } from "next/router";
import UserList from "../userList/UserList";

interface AdminPanelProps {
  users: any[];
  onEditUser: (userId: number) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onEditUser }) => {
  const router = useRouter();

  return (
    <div>
      <UserList users={users} onEditUser={onEditUser} />
      <h2>Administração</h2>
    </div>
  );
};

export default AdminPanel;