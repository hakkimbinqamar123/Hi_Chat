import { useState } from "react";
import { MessageCircleIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 hc-bg"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-5xl mx-auto flex rounded-2xl overflow-hidden glass"
        style={{ border: "1px solid rgba(255,255,255,0.08)", minHeight: "560px" }}
      >
        {/* ── Left: Form ──────────────────────────────── */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}
            >
              <MessageCircleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold grad-text">Hi Chat!</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1">Welcome back 👋</h1>
          <p className="text-slate-400 mb-8 text-sm">Sign in to continue your language journey</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error.response?.data?.message || "Login failed"}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="glass-input w-full h-11 pl-10 pr-4 text-sm"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="glass-input w-full h-11 pl-10 pr-10 text-sm"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="grad-btn w-full h-11 rounded-xl text-sm" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium">Create one</Link>
            </p>
          </form>
        </div>

        {/* ── Right: Illustration ──────────────────── */}
        <div
          className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 relative"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236,72,153,0.4) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 text-center space-y-6">
            <div className="text-8xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-white">Connect worldwide</h2>
            <p className="text-slate-300 max-w-xs">
              Chat, call, and practice languages with people from around the globe
            </p>
            <div className="flex justify-center gap-3 mt-6">
              {["🇺🇸", "🇯🇵", "🇫🇷", "🇧🇷", "🇩🇪"].map((flag, i) => (
                <span key={i} className="text-2xl">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
