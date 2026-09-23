import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircleIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div
      className="glass glass-hover rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="p-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="w-12 h-12 rounded-full object-cover ring-2"
              style={{ ringColor: "rgba(139,92,246,0.4)" }}
            />
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{ background: "#10b981", borderColor: "#07070f" }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{friend.fullName}</h3>
          </div>
        </div>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            {getLanguageFlag(friend.nativeLanguage)}
            {friend.nativeLanguage}
          </span>
          <span
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)" }}
          >
            {getLanguageFlag(friend.learningLanguage)}
            {friend.learningLanguage}
          </span>
        </div>

        {/* Message button */}
        <Link
          to={`/chat/${friend._id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
          }}
        >
          <MessageCircleIcon className="w-4 h-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 inline-block"
      />
    );
  }
  return null;
}
