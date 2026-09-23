import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageCircleIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="neo-box neo-shadow p-5 relative mt-4 h-full flex flex-col">
      {/* ONLINE Badge */}
      <div className="absolute -top-3 -right-3 bg-[var(--neo-pink)] border-[2px] border-[var(--neo-border)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rotate-6 z-10">
        Online
      </div>

      <div className="flex items-center gap-4 mb-6">
        {/* Avatar Square */}
        <div className="w-14 h-14 bg-[var(--neo-yellow)] border-[3px] border-[var(--neo-border)] flex-shrink-0 overflow-hidden">
          {friend.profilePic && (
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              className="w-full h-full object-cover grayscale mix-blend-multiply"
            />
          )}
        </div>
        
        {/* Name */}
        <div className="min-w-0 flex-1">
          <h3 className="neo-heading text-xl truncate">{friend.fullName}</h3>
          <p className="text-[11px] font-medium text-black/60 uppercase">Language partner</p>
        </div>
      </div>

      {/* Language badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-yellow)]">
          {getLanguageFlag(friend.nativeLanguage)} {friend.nativeLanguage}
        </span>
        <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-yellow)]">
          {getLanguageFlag(friend.learningLanguage)} {friend.learningLanguage}
        </span>
      </div>

      {/* Message button */}
      <Link
        to={`/chat/${friend._id}`}
        className="flex items-center justify-center gap-2 w-full py-3 neo-btn bg-[#111111] text-white neo-shadow-blue neo-shadow-hover mt-auto text-xs"
      >
        <MessageCircleIcon className="w-4 h-4 fill-white" />
        SEND MESSAGE
      </Link>
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
        className="h-3 inline-block grayscale contrast-125"
      />
    );
  }
  return null;
}
