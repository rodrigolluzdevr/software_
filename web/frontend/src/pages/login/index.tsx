import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import BackButton from "@/components/back/Back.Button";
import LoginForm from "../../components/loginForm/LoginForm";
import Footer from "../../components/footer/Footer";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formattedCpf = cpf.replace(/\D/g, ""); // Remove non-digits

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: formattedCpf, password }),
      });

      if (!response.ok) {
        throw new Error("Login falhou, verifique suas credenciais");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      const token = data.token?.token;
      if (!token || typeof token !== "string") {
        console.error("Token inválido ou ausente na resposta:", data);
        throw new Error("Token inválido ou ausente na resposta");
      }

      sessionStorage.setItem("token", token);
      const decodedToken = jwtDecode(token) as { role: string };
      sessionStorage.setItem("role", decodedToken.role);

      window.dispatchEvent(new Event("storage"));

      router.push("/dashboard");
    } catch (err: any) {
        setError(err.message);
      }
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-700/[0.8]"></div>
        <div className="container-fluid relative">
          <div className="md:flex items-center">
            <div className="xl:w-[30%] lg:w-1/3 md:w-1/2">
              <div className="relative md:flex flex-col md:min-h-screen justify-center bg-white shadow-sm md:px-10 py-10 px-4 z-1">
                <div className="text-center">
                  <Link href="/">
                    <Image
                      src="/images/logo-icon-64.png"
                      width={72}
                      height={64}
                      placeholder="blur"
                      blurDataURL="/images/logo-icon.png"
                      className="mx-auto"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="title-heading text-center md:my-auto my-20">
                  <LoginForm
                    cpf={cpf}
                    password={password}
                    error={error}
                    onCpfChange={(e) => setCpf(e.target.value)}
                    onPasswordChange={(e) => setPassword(e.target.value)}
                    onSubmit={handleSubmit}
                  />
                </div>
                <Footer />
              </div>
            </div>
            <div className="xl:w-[80%] lg:w-2/3 md:w-1/2 flex justify-center mx-6 md:my-auto my-20 "></div>
          </div>
        </div>
      </section>
      <BackButton />
    </div>
  );
}
