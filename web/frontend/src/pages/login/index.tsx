// Login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, password }),
      });
  
      if (!response.ok) {
        throw new Error("Login falhou, verifique suas credenciais");
      }
  
      const data = await response.json();
      console.log("Resposta da API:", data); // Log da resposta completa
  
      // Obtém o token corretamente
      const token = data.token?.token;
      if (!token || typeof token !== "string") {
        console.error("Token inválido ou ausente na resposta:", data);
        throw new Error("Token inválido ou ausente na resposta");
      }
  
      // Armazena o token e o role no sessionStorage
      sessionStorage.setItem("token", token);
      const decodedToken = jwtDecode(token) as { role: string };
      sessionStorage.setItem("role", decodedToken.role);
  
      // Disparar evento storage para atualizar o withAuth
      window.dispatchEvent(new Event("storage"));
  
      // 🚀 Redireciona todos os usuários para /dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="cpf"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        placeholder="Digete o Cpf"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite a Senha"
        required
      />
      <button type="submit">Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}