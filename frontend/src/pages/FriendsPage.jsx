import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Friends</h1>
            <p className="text-slate-400 text-sm mt-1">{friends.length} connections</p>
          </div>
          <Link
            to="/notifications"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#c4b5fd",
            }}
          >
            <UsersIcon className="w-4 h-4" />
            Friend Requests
          </Link>
        </div>

        {/* Friends grid */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
              style={{ borderTopColor: "#8b5cf6", borderRightColor: "#ec4899" }} />
          </div>
        ) : friends.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">No friends yet</h3>
            <p className="text-slate-400 text-sm">Discover language partners below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Meet New Learners */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Meet New Learners</h2>
            <p className="text-slate-400 text-sm mt-1">Discover perfect language exchange partners</p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
                style={{ borderTopColor: "#8b5cf6", borderRightColor: "#ec4899" }} />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-slate-400">No recommendations available. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="glass glass-hover rounded-2xl p-5"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img src={user.profilePic} alt={user.fullName}
                        className="w-14 h-14 rounded-full object-cover"
                        style={{ boxShadow: "0 0 0 2px rgba(139,92,246,0.3)" }} />
                      <div>
                        <h3 className="font-semibold text-white">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <MapPinIcon className="w-3 h-3" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}>
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)" }}>
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && <p className="text-sm text-slate-400 mb-4 line-clamp-2">{user.bio}</p>}

                    <button
                      className="flex items-center justify-center gap-2 w-full h-9 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={
                        hasRequestBeenSent
                          ? { background: "rgba(255,255,255,0.05)", color: "#94a3b8", cursor: "not-allowed" }
                          : {
                              background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                              color: "#fff",
                              boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                            }
                      }
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
    </div>
  );
};

export default FriendsPage;
