import WebGLScrollContainer from "@/components/WebGLScroll/WebGLScrollContainer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <WebGLScrollContainer>
    <Component {...pageProps} />
  </WebGLScrollContainer>;
}
