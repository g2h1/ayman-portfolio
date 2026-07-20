import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Intro from "./components/Intro";
import VisitorGate from "./components/VisitorGate";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const SESSION_KEY = "ayman-portfolio-intro-seen";

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => typeof window !== "undefined" &&
      !window.sessionStorage.getItem(SESSION_KEY)
  );

  return (
    <LanguageProvider>
      <AuthProvider>
        {showIntro && <Intro onFinish={() => setShowIntro(false)} />}
        {!showIntro && <VisitorGate />}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </LanguageProvider>
  );
}
