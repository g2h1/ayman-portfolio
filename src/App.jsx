import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

const SESSION_KEY = "ayman-portfolio-intro-seen";

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== "undefined" &&
      !window.sessionStorage.getItem(SESSION_KEY)
  );

  return (
    <LanguageProvider>
      {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  );
}
