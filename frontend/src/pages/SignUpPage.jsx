import { useState } from "react";
import { MessageCircleIcon, UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hc-bg">
      <div
        className="w-full max-w-5xl mx-auto flex rounded-2xl overflow-hidden glass"
        style={{ border: "1px solid rgba(255,255,255,0.08)", minHeight: "600px" }}
      >
        {/* ── Left: Illustration ───────────────────── */}
        <div
          className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 relative"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, rgba(139,92,246,0.5) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(236,72,153,0.4) 0%, transparent 50%)",
            }}
          />
          <div className="relative z-10 text-center space-y-6">
            <div className="text-8xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-white">Join the community</h2>
            <p className="text-slate-300 max-w-xs">
              Meet language learners from every corner of the world and start connecting today
            </p>
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              {[
                { emoji: "💬", label: "Chat" },
                { emoji: "📞", label: "Call" },
                { emoji: "🌐", label: "Learn" },
              ].map(({ emoji, label }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl glass text-sm font-medium text-slate-200"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Form ─────────────────────────── */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}
            >
              <MessageCircleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold grad-text">Hi Chat!</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400 mb-8 text-sm">Join and start your language learning adventure!</p>

          {error && (
            <div
              className="mb-4 p-3 rounded-xl text-sm text-red-300"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              {error.response?.data?.message || "Signup failed"}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="glass-input w-full h-11 pl-10 pr-4 text-sm"
                  value={signupData.fullName}
                  onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="glass-input w-full h-11 pl-10 pr-4 text-sm"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
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
                  placeholder="Min. 6 characters"
                  className="glass-input w-full h-11 pl-10 pr-10 text-sm"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-violet-500" required />
              <span className="text-xs text-slate-400 leading-relaxed">
                I agree to the{" "}
                <span className="text-violet-400 hover:underline cursor-pointer">terms of service</span> and{" "}
                <span className="text-violet-400 hover:underline cursor-pointer">privacy policy</span>
              </span>
            </label>

            <button type="submit" className="grad-btn w-full h-11 rounded-xl text-sm" disabled={isPending}>
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
