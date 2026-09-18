"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return setError("Enter your email address.");
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: normalizedEmail, password }) });
      if (!response.ok) {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        setError(data?.error ?? "Unable to sign in right now. Please try again.");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="admin-login-page"><section className="admin-login-frame" aria-labelledby="admin-login-title"><aside className="admin-login-aside"><div className="admin-login-brand"><span className="admin-login-mark">M</span><span><strong>Muntazir Admin</strong><small>Furniture OS</small></span></div><div className="admin-login-aside-copy"><p className="admin-login-eyebrow">OPERATIONS, CONSIDERED</p><h2>Make every room<br /><i>move beautifully.</i></h2><p>A focused workspace for the people, products, and orders behind Muntazir &amp; Sons.</p></div><div className="admin-login-aside-footer"><span><i className="fa-solid fa-chart-line" /> Store operations</span><span><i className="fa-solid fa-lock" /> Private workspace</span></div></aside><div className="admin-login-content"><div className="admin-login-heading"><p className="admin-login-eyebrow">SECURE WORKSPACE</p><h1 id="admin-login-title">Welcome back.</h1><p>Sign in to continue to your admin dashboard.</p></div><form onSubmit={handleSubmit} noValidate><label className="admin-login-field"><span>Email address</span><span className="admin-login-input-wrap"><i className="fa-regular fa-envelope" /><input name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error && !email)} placeholder="you@company.com" /></span></label><label className="admin-login-field"><span>Password</span><span className="admin-login-password admin-login-input-wrap"><i className="fa-solid fa-lock" /><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(error && !password)} placeholder="Enter your password" /><button type="button" className="admin-login-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}><i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} /></button></span></label>{error && <p className="admin-login-error" role="alert"><i className="fa-solid fa-circle-exclamation" />{error}</p>}<button className="admin-login-submit" type="submit" disabled={loading}>{loading ? <><i className="fa-solid fa-circle-notch fa-spin" /> Signing in...</> : <>Sign in <i className="fa-solid fa-arrow-right" /></>}</button></form><div className="admin-login-bottom"><p className="admin-login-note"><i className="fa-solid fa-shield-halved" /> Protected admin access</p><span className="admin-login-version">M&amp;S / ADMIN 01</span></div></div></section></main>;
}

<style jsx global>{`
  .admin-login-page { min-height: 100vh; display: grid; place-items: center; padding: clamp(18px, 4vw, 54px); background: #f5f2ee; color: #1b1a19; font-family: 'DM Sans', sans-serif; }
  .admin-login-frame { display: grid; grid-template-columns: minmax(280px, .88fr) minmax(390px, 1.12fr); width: min(100%, 940px); min-height: 590px; overflow: hidden; background: #fff; border: 1px solid rgba(231, 226, 220, .9); border-radius: 28px; box-shadow: 0 28px 80px rgba(30, 25, 20, .1), 0 4px 12px rgba(30, 25, 20, .04); }
  .admin-login-aside { display: flex; flex-direction: column; justify-content: space-between; padding: clamp(30px, 5vw, 52px); background: #171614; border-radius: 27px 0 0 27px; color: #f5f2ee; position: relative; overflow: hidden; }
  .admin-login-aside::after { content: ''; position: absolute; width: 280px; height: 280px; right: -130px; bottom: -115px; border: 1px solid rgba(233, 95, 42, .46); border-radius: 50%; box-shadow: 0 0 0 28px rgba(233, 95, 42, .06), 0 0 0 58px rgba(233, 95, 42, .04); }
  .admin-login-brand, .admin-login-password, .admin-login-input-wrap, .admin-login-submit, .admin-login-note, .admin-login-aside-footer { display: flex; align-items: center; }
  .admin-login-brand { gap: 12px; position: relative; z-index: 1; }
  .admin-login-mark { display: grid; place-items: center; width: 42px; height: 42px; border: 1.5px solid #e95f2a; border-radius: 50%; color: #e95f2a; font: italic 24px 'Playfair Display', serif; }
  .admin-login-brand strong, .admin-login-brand small { display: block; }
  .admin-login-brand strong { font-size: 15px; letter-spacing: -.02em; }
  .admin-login-brand small { margin-top: 4px; color: #99938c; font-size: 9px; letter-spacing: .2em; text-transform: uppercase; }
  .admin-login-aside-copy { position: relative; z-index: 1; max-width: 280px; margin: auto 0; }
  .admin-login-aside-copy h2 { margin: 0; font: 500 clamp(30px, 4vw, 43px)/1.05 'Playfair Display', serif; letter-spacing: -.03em; }
  .admin-login-aside-copy h2 i { color: #e95f2a; font-weight: 500; }
  .admin-login-aside-copy > p:last-child { display: none; max-width: 240px; margin: 24px 0 0; color: #aaa49d; font-size: 13px; line-height: 1.7; }
  .admin-login-aside-footer { position: relative; z-index: 1; flex-wrap: wrap; gap: 14px 22px; color: #99938c; font-size: 10px; letter-spacing: .05em; text-transform: uppercase; }
  .admin-login-aside-footer span { display: inline-flex; align-items: center; gap: 7px; }
  .admin-login-aside-footer i { color: #e95f2a; }
  .admin-login-content { display: flex; flex-direction: column; justify-content: center; padding: clamp(34px, 7vw, 82px); }
  .admin-login-eyebrow { margin: 0 0 10px; color: #e95f2a; font-size: 10px; font-weight: 700; letter-spacing: .16em; }
  .admin-login-heading h1 { margin: 0; font: 600 clamp(32px, 5vw, 46px)/1.1 'Playfair Display', serif; letter-spacing: -.03em; }
  .admin-login-heading p:last-child { margin: 12px 0 38px; color: #6f6b66; font-size: 14px; }
  .admin-login-field { display: block; margin-top: 20px; color: #4d4944; font-size: 11px; font-weight: 700; letter-spacing: .02em; }
  .admin-login-input-wrap { position: relative; margin-top: 8px; }
  .admin-login-input-wrap > i { align-items: center; background: #f0ede9; border-radius: 50%; color: #77716a; display: flex; font-size: 11px; height: 25px; justify-content: center; left: 10px; position: absolute; width: 25px; z-index: 1; }
  .admin-login-field input { width: 100%; margin: 0; padding: 15px 14px 15px 46px; border: 1px solid #d8d2ca; border-radius: 14px; background: #fcfbfa; color: #1b1a19; outline: none; transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
  .admin-login-field input:focus { border-color: #e95f2a; background: #fff; box-shadow: 0 0 0 3px rgba(233, 95, 42, .12); }
  .admin-login-password input { padding-right: 44px; }
  .admin-login-toggle { align-items: center; background: #f0ede9; border-radius: 50%; color: #77716a; display: flex; height: 28px; justify-content: center; position: absolute; right: 9px; transition: background .2s ease, color .2s ease; width: 28px; }
  .admin-login-toggle:hover { background: #e95f2a; color: #fff; }
  .admin-login-error { display: flex; gap: 8px; align-items: center; margin: 16px 0 0; color: #b93636; font-size: 12px; }
  .admin-login-submit { justify-content: center; gap: 10px; width: 100%; margin-top: 28px; padding: 15px; background: #e95f2a; border-radius: 999px; color: #fff; font-weight: 700; letter-spacing: .01em; transition: background .2s ease, transform .2s ease, box-shadow .2s ease; }
  .admin-login-submit:hover:not(:disabled) { background: #cc4e20; transform: translateY(-1px); }
  .admin-login-bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 30px; padding-top: 18px; border-top: 1px solid #eeeae5; }
  .admin-login-note { gap: 7px; margin: 0; color: #8a847d; font-size: 11px; }
  .admin-login-version { color: #b0aaa3; font-size: 9px; letter-spacing: .12em; }
  @media (max-width: 720px) { .admin-login-frame { grid-template-columns: 1fr; } .admin-login-aside { border-radius: 27px 27px 0 0; min-height: 290px; } .admin-login-aside-copy { margin: 44px 0 0; } .admin-login-aside-copy h2 { font-size: 34px; } .admin-login-content { padding: 38px clamp(24px, 8vw, 54px) 42px; } }
  @media (max-width: 480px) { .admin-login-page { padding: 12px; } .admin-login-frame { border-radius: 22px; } .admin-login-aside { border-radius: 21px 21px 0 0; min-height: 260px; padding: 28px 24px; } .admin-login-aside-copy { margin-top: 28px; } .admin-login-aside-footer { font-size: 9px; } .admin-login-content { padding: 34px 22px 30px; } .admin-login-bottom { align-items: flex-start; flex-direction: column; } }
`}</style>;