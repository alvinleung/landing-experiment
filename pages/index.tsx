import Image from "next/image";
import { Inter } from "next/font/google";
import WebGLScrollContainer from "@/components/WebGLScroll/WebGLScrollContainer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <WebGLScrollContainer>
    <main className={`${inter.style}`}>
      fdsa
    </main>
  </WebGLScrollContainer>;
}
