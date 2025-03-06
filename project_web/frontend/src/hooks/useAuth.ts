import { useRouter } from "next/router";
import { useEffect } from "react";

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Se não houver token, redireciona para a página de login
    if (!token) {
      router.push("/login");
    }
  }, [router]);
};

export default useAuth;