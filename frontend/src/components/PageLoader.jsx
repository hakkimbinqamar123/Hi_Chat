import { MessageCircleIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "#07070f" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 8px 30px rgba(139,92,246,0.4)" }}
        >
          <MessageCircleIcon className="w-6 h-6 text-white" />
        </div>
        <span
          className="text-3xl font-bold"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Hi Chat!
        </span>
      </div>

      {/* Spinner */}
      <div
        className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: "#8b5cf6",
          borderRightColor: "#ec4899",
        }}
      />

      <p className="text-slate-500 text-sm">Loading your experience...</p>
    </div>
  );
};

export default PageLoader;
