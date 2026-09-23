import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, MessageCircleIcon, UsersIcon, UserIcon, SparklesIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const startAIChat = () => {
    navigate(`/chat/gemini-ai-bot`);
  };

  const navLinks = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/friends", icon: UsersIcon, label: "Friends" },
    { to: "/notifications", icon: BellIcon, label: "Notifications" },
    { to: "/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <aside
      className="w-64 hidden lg:flex flex-col h-screen sticky top-0"
      style={{
        background: "rgba(10,10,20,0.85)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
          >
            <MessageCircleIcon className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Hi Chat!
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive ? "sidebar-active text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-violet-400" : ""}`} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* AI Chat Button */}
        <button
          onClick={startAIChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:bg-white/5 text-left mt-2"
          style={{ border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.06)" }}
        >
          <SparklesIcon className="w-5 h-5 text-pink-400" />
          <span
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "700",
            }}
          >
            Chat with AI
          </span>
        </button>
      </nav>

      {/* User profile section */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <div className="relative">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2"
              style={{ ringColor: "rgba(139,92,246,0.5)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{ background: "#10b981", borderColor: "#07070f" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{authUser?.fullName}</p>
            <p className="text-xs text-emerald-400">● Online</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
