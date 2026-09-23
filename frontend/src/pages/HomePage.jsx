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

const HomePage = () => {
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12">

        {/* Friends section header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b-[3px] border-[var(--neo-border)] pb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold neo-heading tracking-tighter uppercase leading-none">
              Your Friends
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[var(--neo-yellow)] border-[3px] border-[var(--neo-border)] px-4 py-2 text-sm font-bold uppercase tracking-wider neo-shadow">
              {friends.length} {friends.length === 1 ? 'connection' : 'connections'}
            </div>
            <Link
              to="/notifications"
              className="px-6 py-2 bg-[var(--neo-blue)] text-white border-[3px] border-[var(--neo-border)] text-sm font-bold uppercase tracking-wider neo-shadow neo-shadow-hover transition-transform"
            >
              Friend Requests
            </Link>
          </div>
        </div>

        {/* Friends grid */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-black border-t-[var(--neo-yellow)] animate-spin" />
          </div>
        ) : friends.length === 0 ? (
          <div className="neo-box neo-shadow p-12 text-center flex flex-col items-center max-w-xl mx-auto">
            <div className="text-6xl mb-6">☹️</div>
            <h3 className="neo-heading text-3xl mb-3">No friends yet</h3>
            <p className="text-black/70 font-medium text-lg">Discover language partners below and send them a request!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Meet New Learners */}
        <section className="pt-8">
          <div className="mb-8">
            <h2 className="neo-heading text-4xl mb-2">Meet New Learners</h2>
            <p className="text-black/70 font-medium text-lg">Discover perfect language exchange partners</p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-black border-t-[var(--neo-yellow)] animate-spin" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="neo-box neo-shadow p-8 text-center relative bg-white overflow-hidden max-w-3xl mx-auto">
              <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full border-[3px] border-[var(--neo-border)] bg-[var(--neo-bg)] z-10"></div>
              <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full border-[3px] border-[var(--neo-border)] bg-[var(--neo-bg)] z-10"></div>
              <p className="font-bold text-lg tracking-wide uppercase">No recommendations available. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="neo-box neo-shadow p-6 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 bg-[var(--neo-pink)] border-[3px] border-black overflow-hidden flex-shrink-0">
                        {user.profilePic && (
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="w-full h-full object-cover grayscale mix-blend-multiply"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="neo-heading text-xl truncate">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-black/60 uppercase mt-1">
                            <MapPinIcon className="w-3 h-3" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-yellow)]">
                        {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 font-bold uppercase border-[2px] border-[var(--neo-border)] bg-[var(--neo-yellow)]">
                        {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && <p className="text-xs font-bold text-black/70 mb-6 line-clamp-2">{user.bio}</p>}

                    <button
                      className="mt-auto flex items-center justify-center gap-2 w-full py-3 neo-btn text-xs neo-shadow-hover transition-all"
                      style={
                        hasRequestBeenSent
                          ? { background: "#e2e8f0", color: "#64748b", cursor: "not-allowed", boxShadow: "none", transform: "none" }
                          : { background: "var(--neo-pink)", color: "white" }
                      }
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <><CheckCircleIcon className="w-4 h-4" /> Request Sent</>
                      ) : (
                        <><UserPlusIcon className="w-4 h-4 fill-white" /> Send Request</>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
