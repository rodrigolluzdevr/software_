import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  role: string;
  address: string;
  cep: string;
  numberAdress: string;
  organizationId: number;
}

export default function UpdateUser() {
  const router = useRouter();
  const { userId } = router.query;

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [numberAdress, setNumberAdress] = useState('');
  const [organizationId, setOrganizationId] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;

    // Fetch user data
    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:4000/users/${userId}`);
        const data = await response.json();
        setName(data.name);
        setCpf(data.cpf);
        setRole(data.role);
        setEmail(data.email);
        setAddress(data.address);
        setCep(data.cep);
        setNumberAdress(data.numberAdress);
        setOrganizationId(data.organizationId);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    }
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cpf, password, role, email, address, cep, numberAdress, organizationId }),
      });

      if (!response.ok) {
        throw new Error('Atualização falhou, tente novamente');
      }

      alert('Atualização bem-sucedida!');
      router.push('/dashboard/Admin'); // Redireciona para a página de dashboard após a atualização
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" required />
      <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Cargo" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Endereço" required />
      <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" required />
      <input type="text" value={numberAdress} onChange={(e) => setNumberAdress(e.target.value)} placeholder="Número" required />
      <button type="submit">Atualizar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}