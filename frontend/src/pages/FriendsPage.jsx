import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="pt-8 pb-16">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <h1 className="neo-heading text-5xl sm:text-6xl leading-[0.9] tracking-tighter">
          YOUR<br />FRIENDS
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="bg-[var(--neo-yellow)] border-[3px] border-[var(--neo-border)] px-4 py-2 text-sm font-bold tracking-tight uppercase">
            {friends.length} Connection{friends.length !== 1 ? 's' : ''}
          </div>
          <Link to="/notifications">
            <button className="bg-[var(--neo-blue)] text-white border-[3px] border-[var(--neo-border)] px-6 py-2 text-sm font-bold tracking-tight uppercase neo-shadow-hover neo-shadow">
              Friend Requests
            </button>
          </Link>
        </div>
      </div>

      <hr className="border-b-[4px] border-[var(--neo-border)] mt-6 mb-12" />

      {/* FRIENDS SECTION */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Left: Friends Grid */}
        <div className="flex-1">
          {loadingFriends ? (
            <div className="neo-box p-8 text-center font-bold uppercase">Loading...</div>
          ) : friends.length === 0 ? (
            <div className="neo-box neo-shadow p-10 text-center">
              <h3 className="neo-heading text-2xl mb-2">No friends yet</h3>
              <p>Discover language partners below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Summary Text (Visible if friends exist) */}
        {friends.length > 0 && (
          <div className="w-full lg:w-1/3 pt-4">
            <h2 className="neo-heading text-2xl mb-2 lowercase first-letter:uppercase">
              {friends.length} connection<br/>and counting.
            </h2>
            <div className="font-bold text-lg mb-4">---------</div>
            <p className="text-sm font-medium text-black/70 max-w-sm leading-relaxed">
              Every conversation is a step toward fluency. Keep the streak going — message {friends[0]?.fullName.split(' ')[0]} or find someone new below.
            </p>
          </div>
        )}
      </div>

      {/* MEET NEW LEARNERS */}
      <section>
        <div className="mb-6">
          <h2 className="neo-heading text-2xl">Meet New Learners</h2>
          <p className="text-sm font-medium text-black/70">Discover perfect language exchange partners</p>
        </div>

        {loadingUsers ? (
          <div className="neo-box p-8 text-center font-bold uppercase">Loading...</div>
        ) : recommendedUsers.length === 0 ? (
          <div className="relative bg-white border-[3px] border-[var(--neo-border)] p-8 text-center overflow-hidden">
            {/* Cutouts to make it look like a ticket */}
            <div className="absolute top-1/2 -left-[14px] -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--neo-bg)] border-[3px] border-[var(--neo-border)]"></div>
            <div className="absolute top-1/2 -right-[14px] -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--neo-bg)] border-[3px] border-[var(--neo-border)]"></div>
            
            <p className="font-bold text-sm tracking-tight">No recommendations available. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return (
                <div key={user._id} className="neo-box neo-shadow p-6 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 border-[3px] border-[var(--neo-border)] bg-[var(--neo-yellow)] overflow-hidden shrink-0">
                      <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover grayscale" />
                    </div>
                    <div>
                      <h3 className="neo-heading text-lg truncate">{user.fullName}</h3>
                      {user.location && (
                        <div className="flex items-center gap-1 text-xs font-bold mt-1 uppercase">
                          <MapPinIcon className="w-3 h-3" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-yellow)]">
                      {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-blue)] text-white">
                      {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                    </span>
                  </div>

                  {user.bio && <p className="text-sm font-medium mb-6 line-clamp-2 flex-grow">{user.bio}</p>}

                  <button
                    className={`flex items-center justify-center gap-2 w-full py-3 text-sm transition-all neo-btn mt-auto ${
                      hasRequestBeenSent
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400"
                        : "bg-[#111111] text-white neo-shadow-hover neo-shadow-blue"
                    }`}
                    onClick={() => sendRequestMutation(user._id)}
                    disabled={hasRequestBeenSent || isPending}
                  >
                    {hasRequestBeenSent ? (
                      <><CheckCircleIcon className="w-4 h-4" /> Request Sent</>
                    ) : (
                      <><UserPlusIcon className="w-4 h-4" /> Send Request</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default FriendsPage;
