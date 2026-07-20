import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

const VISITOR_TYPE_KEY = "ayman-portfolio-visitor-type";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // نوع الزائر السريع (من غير تسجيل دخول) — عميل أو شركة
  const [visitorType, setVisitorType] = useState(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(VISITOR_TYPE_KEY);
  });

  const setAndStoreVisitorType = (type) => {
    setVisitorType(type);
    window.localStorage.setItem(VISITOR_TYPE_KEY, type);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (isMounted) {
        setUser(session?.user || null);
        if (session?.user) await loadProfile(session.user.id);
        setLoading(false);
      }
    }

    async function loadProfile(userId) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (isMounted) setProfile(data || null);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // النوع الفعلي المستخدم لتخصيص القائمة:
  // لو مسجل دخول، بناخد نوعه من الحساب. لو لأ، بناخد الاختيار السريع المحفوظ.
  const effectiveType = profile?.account_type || visitorType;

  const value = {
    user,
    profile,
    loading,
    signOut,
    visitorType,
    setVisitorType: setAndStoreVisitorType,
    effectiveType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
