// components/headerWrapper.js
"use client"; // Necesario para usar `useEffect` y el estado en el cliente
import { useEffect, useState } from "react";
import Header from "./header";
import Header2 from "./header2";

export default function HeaderWrapper() {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isTop ? <Header2 /> : <Header />;
}
