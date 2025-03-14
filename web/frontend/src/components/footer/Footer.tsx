import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="text-center">
    <div className="mb-0 text-black font-light text-xs">
      © {new Date().getFullYear()} SIGedu. desenvolvido por
      <Link
        href="https://github.com/rodrigolluzdevr"
        target="_blank"
        className="text-reset font-bold mx-1"
      >
        devr sistemas e tecnologia.
      </Link>
    </div>
    <div className='text-black font-light text-xs'>todos os direitos reservados.</div>
  </footer>
);

export default Footer;
