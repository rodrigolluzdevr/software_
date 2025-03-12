import React from "react";
import Link from "next/link";

const Footer: React.FC = () => (
  <div className="text-center">
    <p className="mb-0 text-slate-400">
      © {new Date().getFullYear()} SIGedu. desenvolvido por
      <Link
        href="https://github.com/rodrigolluzdevr"
        target="_blank"
        className="text-reset font-bold mx-1"
      >
        devr sistemas e tecnologia
      </Link>
      . Todos os direitos reservados.
    </p>
  </div>
);

export default Footer;