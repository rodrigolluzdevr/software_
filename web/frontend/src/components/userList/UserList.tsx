import React from "react";

interface UserListProps {
  users: any[];
  onEditUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUser }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => onEditUser(user.id)}>Editar</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;