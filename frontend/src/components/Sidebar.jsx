import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { HomeIcon, UsersIcon, MailIcon, UserIcon, SparklesIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const startAIChat = () => {
    if (!authUser) return;
    const channelId = [authUser._id, "gemini-ai-bot"].sort().join("-");
    navigate(`/chat/${channelId}`);
  };

  const navLinks = [
    { to: "/", icon: HomeIcon, label: "HOME", type: "link" },
    { to: "/friends", icon: UsersIcon, label: "FRIENDS", type: "link" },
    { to: "/notifications", icon: MailIcon, label: "ALERTS", type: "link" },
    { to: "/profile", icon: UserIcon, label: "PROFILE", type: "link" },
    { to: "#", icon: SparklesIcon, label: "AI CHAT", color: "var(--neo-pink)", type: "button", onClick: startAIChat }
  ];

  return (
    <div className="h-full bg-[#111111] flex flex-col items-center py-8 px-4 w-24 sm:w-28 mt-auto shadow-[4px_0_20px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col items-center justify-start h-full gap-8">
        {navLinks.map((item) => {
          const isActive = currentPath === item.to;
          
          let color = item.color;
          if (!color) {
             color = isActive ? "var(--neo-yellow)" : "#6b7280";
          }

          const Content = () => (
            <div className="flex flex-col items-center gap-2 group cursor-pointer w-14 sm:w-20">
              <div 
                className="w-12 h-12 flex items-center justify-center border-2 transition-transform group-hover:-translate-y-1 bg-transparent"
                style={{ borderColor: color }}
              >
                <item.icon style={{ color: color }} className="w-6 h-6" />
              </div>
              <span 
                className="text-[10px] sm:text-xs font-bold neo-heading tracking-wider"
                style={{ color: color }}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.type === "button") {
            return (
              <button key={item.label} onClick={item.onClick} className="focus:outline-none">
                <Content />
              </button>
            );
          }

          return (
            <Link key={item.label} to={item.to} className="focus:outline-none">
              <Content />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
