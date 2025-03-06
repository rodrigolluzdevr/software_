// pages/_app.tsx
import { AppProps } from "next/app";
import "@/styles/globals.css";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
