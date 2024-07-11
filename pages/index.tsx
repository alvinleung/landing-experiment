import Image from "next/image";
import { Inter } from "next/font/google";
import WebGLScrollContainer from "@/components/WebGLScroll/WebGLScrollContainer";
import { MutableRefObject, RefObject, useRef } from "react";
import SnapContainer from "@/components/WebGLScroll/Snapping/SnapContainer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <>
    <main className={`${inter.style}`}>
      <SnapContainer>
        <div className={`min-h-screen w-full flex justify-center items-center`}>
          Here is the hero content
        </div>
      </SnapContainer>
      <SnapContainer>
        <div className="min-h-screen text-9xl bg-white text-black">
          We’re excited by the possibilities of technology, constantly exploring new means of expression and highly detailed in their practice.
        </div>
      </SnapContainer>
      <SnapContainer>
        <div className="min-h-screen text-9xl bg-white text-black">
          We’re excited by the possibilities of technology, constantly exploring new means of expression and highly detailed in their practice.
        </div>
        <div className="min-h-screen text-9xl bg-white text-black">
          We’re excited by the possibilities of technology, constantly exploring new means of expression and highly detailed in their practice.
        </div>
        <div className="min-h-screen text-9xl bg-white text-black">
          We’re excited by the possibilities of technology, constantly exploring new means of expression and highly detailed in their practice.
        </div>
        <div className="min-h-screen text-9xl bg-white text-black">
          We’re excited by the possibilities of technology, constantly exploring new means of expression and highly detailed in their practice.
        </div>
      </SnapContainer>
    </main>
    <footer>
      Stay in touch
    </footer>
  </>
}
