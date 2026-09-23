import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, CheckIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">
            {incomingRequests.length + acceptedRequests.length} updates
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
              style={{ borderTopColor: "#8b5cf6", borderRightColor: "#ec4899" }}
            />
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <UserCheckIcon className="w-5 h-5 text-violet-400" />
                  Friend Requests
                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}
                  >
                    {incomingRequests.length}
                  </span>
                </h2>

                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="glass glass-hover rounded-2xl p-4"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={request.sender.profilePic}
                          alt={request.sender.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                          style={{ boxShadow: "0 0 0 2px rgba(139,92,246,0.3)" }}
                        />
                        <div>
                          <h3 className="font-semibold text-white">{request.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}
                            >
                              Native: {request.sender.nativeLanguage}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(6,182,212,0.15)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)" }}
                            >
                              Learning: {request.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                          color: "#fff",
                          boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                          opacity: isPending ? 0.6 : 1,
                        }}
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isPending}
                      >
                        <CheckIcon className="w-4 h-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Accepted Requests (new connections) */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <BellIcon className="w-5 h-5 text-emerald-400" />
                  New Connections
                </h2>

                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="glass rounded-2xl p-4"
                    style={{ border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={notification.recipient.profilePic}
                        alt={notification.recipient.fullName}
                        className="w-10 h-10 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{notification.recipient.fullName}</h3>
                        <p className="text-sm text-slate-400 my-1">
                          {notification.recipient.fullName} accepted your friend request
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          Recently
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                        style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}
                      >
                        <MessageSquareIcon className="w-3 h-3" />
                        New Friend
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Empty state */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div
                className="glass rounded-2xl p-12 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-5xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                <p className="text-slate-400 text-sm">No new notifications right now</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
