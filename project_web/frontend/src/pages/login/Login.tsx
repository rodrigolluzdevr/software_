// Login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login falhou, verifique suas credenciais");
      }

      const data = await response.json();
      console.log("Resposta da API:", data); // Log da resposta completa

      // Acessa o token dentro do objeto aninhado
      const token = data.token?.token;

      // Verifica se o token está presente e é uma string
      if (!token || typeof token !== "string") {
        console.error("Token inválido ou ausente na resposta:", data); // Log de erro
        throw new Error("Token inválido ou ausente na resposta");
      }

      // Armazena o token e o role no sessionStorage
      sessionStorage.setItem("token", token); // Usando sessionStorage
      const decodedToken = jwtDecode(token) as { role: string };
      const userRole = decodedToken.role;
      sessionStorage.setItem("role", userRole); // Armazena o role

      // Disparar evento storage para atualizar o withAuth (nova adição)
      window.dispatchEvent(new Event("storage"));

      // Redireciona com base no role
      switch (userRole) {
        case "ADMIN":
          router.push("/dashboard/Admin");
          break;
        case "PROFESSOR":
          router.push("/dashboard/Professor");
          break;
        case "SECRETARIO":
          router.push("/dashboard/Secretario");
          break;
        case "COORDENADOR":
          router.push("/dashboard/Coordenador");
          break;
        case "DIRETOR":
          router.push("/dashboard/Diretor");
          break;
        case "USER":
          router.push("/dashboard/User");
          break;
        default:
          router.push("/"); // Redireciona para a página inicial
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit">Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}