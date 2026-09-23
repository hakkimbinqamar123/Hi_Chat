import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { MessageSquareIcon, PowerIcon, SparklesIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  return (
    <nav className="sticky top-0 z-30 h-16 w-full flex items-center justify-center bg-[#111111] text-white">
      <div className="flex items-center justify-between w-full px-4 sm:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[var(--neo-yellow)] border-[2px] border-white flex items-center justify-center neo-shadow-hover transition-transform group-hover:-translate-y-0.5">
            <MessageSquareIcon className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="neo-heading text-xl tracking-tight" style={{ color: "white" }}>HI Chat!</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          
          {/* AI Chat / Messages */}
          <Link to="/chat/gemini-ai-bot" title="Chat with AI">
            <button className="h-9 w-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
              <SparklesIcon className="w-4 h-4" />
            </button>
          </Link>

          {/* Profile */}
          <Link to="/profile" title="Profile">
            <div className="h-9 border border-white flex items-center px-2 gap-2 cursor-pointer hover:bg-white hover:text-black transition-colors group">
              <div className="w-5 h-5 bg-[var(--neo-pink)]">
                {/* No image in the mockup, just a pink square, but we'll show their pic if available */}
                {authUser?.profilePic ? (
                  <img src={authUser.profilePic} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt="Avatar" />
                ) : null}
              </div>
              <span className="text-sm font-bold truncate max-w-[100px]">{authUser?.fullName || "hakkim"}</span>
            </div>
          </Link>

          {/* Logout */}
          <button
            className="h-9 w-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logoutMutation();
              }
            }}
            title="Logout"
          >
            <PowerIcon className="w-4 h-4" />
          </button>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
