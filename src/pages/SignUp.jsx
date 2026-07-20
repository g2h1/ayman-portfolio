import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import Turnstile from "../components/Turnstile";

export default function SignUp() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("client");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError(t.auth.captchaRequired);
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        captchaToken,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          account_type: accountType,
        },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setDone(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  if (done) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-black text-paper">{t.auth.checkEmailTitle}</h1>
        <p className="mt-3 text-sm text-paper-muted">{t.auth.checkEmailText}</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-paper hover:bg-ember-glow transition-colors"
        >
          {t.auth.goToLogin}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-black text-paper">{t.auth.signUpTitle}</h1>
      <p className="mt-2 text-sm text-paper-muted">{t.auth.signUpSubtitle}</p>

      <button
        onClick={handleGoogle}
        type="button"
        className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-full border border-ink-line px-5 py-3 text-sm font-bold text-paper hover:border-ember transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8H1.4v3.1A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.4a12 12 0 0 0 0 11l4-3.1Z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A11.6 11.6 0 0 0 12 0 12 12 0 0 0 1.4 6.5l4 3.1c1-2.8 3.6-4.8 6.6-4.8Z" />
        </svg>
        {t.auth.continueWithGoogle}
      </button>

      <div className="mt-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-ink-line" />
        <span className="text-xs text-paper-muted">{t.auth.orLabel}</span>
        <span className="h-px flex-1 bg-ink-line" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-paper-muted mb-1.5">
            {t.auth.fullName}
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-ember transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-paper-muted mb-1.5">
            {t.auth.email}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-ember transition-colors"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-paper-muted mb-1.5">
            {t.auth.phone}
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-ember transition-colors"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-paper-muted mb-1.5">
            {t.auth.password}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-line bg-ink-soft px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-ember transition-colors"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-paper-muted mb-2">
            {t.auth.accountType}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAccountType("client")}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                accountType === "client"
                  ? "border-ember bg-ember/10 text-paper"
                  : "border-ink-line text-paper-muted"
              }`}
            >
              {t.auth.client}
            </button>
            <button
              type="button"
              onClick={() => setAccountType("company")}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                accountType === "company"
                  ? "border-ember bg-ember/10 text-paper"
                  : "border-ink-line text-paper-muted"
              }`}
            >
              {t.auth.company}
            </button>
          </div>
        </div>

        <Turnstile onVerify={setCaptchaToken} />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ember px-6 py-3 text-sm font-bold text-paper hover:bg-ember-glow transition-colors disabled:opacity-50"
        >
          {loading ? t.auth.loading : t.auth.signUpCta}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-muted">
        {t.auth.haveAccount}{" "}
        <Link to="/login" className="text-ember font-bold hover:underline">
          {t.auth.login}
        </Link>
      </p>
    </section>
  );
}
