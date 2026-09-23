import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageCircleIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav
      className="sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6"
      style={{
        background: "rgba(10,10,20,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo — only on chat page */}
        {isChatPage && (
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
            >
              <MessageCircleIcon className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold"
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
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications bell */}
          <Link to="/notifications">
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5 text-slate-400" />
            </button>
          </Link>

          {/* Avatar → Profile */}
          <Link to="/profile" title="Edit profile">
            <div
              className="w-9 h-9 rounded-full overflow-hidden ring-2 cursor-pointer transition-all duration-200 hover:ring-violet-500"
              style={{ ringColor: "rgba(139,92,246,0.4)" }}
            >
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Logout */}
          <button
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logoutMutation();
              }
            }}
            title="Logout"
          >
            <LogOutIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
