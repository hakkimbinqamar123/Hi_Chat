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
          <h1 className="text-4xl sm:text-5xl font-bold text-black neo-heading tracking-tighter uppercase">Notifications</h1>
          <p className="text-black font-bold uppercase text-sm mt-2 border-2 border-black inline-block px-3 py-1 bg-[var(--neo-yellow)]">
            {incomingRequests.length + acceptedRequests.length} updates
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 bg-[var(--neo-yellow)] border-4 border-black animate-spin neo-shadow" />
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-black neo-heading tracking-tighter uppercase">
                  <UserCheckIcon className="w-6 h-6 stroke-[3]" />
                  Friend Requests
                  <span className="ml-2 px-3 py-1 bg-[var(--neo-pink)] border-2 border-black text-black text-xs font-bold neo-shadow">
                    {incomingRequests.length}
                  </span>
                </h2>

                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white border-[3px] border-black neo-shadow p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.sender.profilePic}
                          alt={request.sender.fullName}
                          className="w-16 h-16 object-cover border-[3px] border-black neo-shadow"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-black neo-heading uppercase tracking-tighter">{request.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-1 font-bold uppercase border-2 border-black bg-[var(--neo-yellow)] text-black">
                              Native: {request.sender.nativeLanguage}
                            </span>
                            <span className="text-xs px-2 py-1 font-bold uppercase border-2 border-black bg-[var(--neo-blue)] text-black">
                              Learning: {request.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-[3px] border-black bg-[var(--neo-green)] text-black text-sm font-bold uppercase neo-shadow-hover transition-transform"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isPending}
                      >
                        <CheckIcon className="w-5 h-5 stroke-[3]" />
                        {isPending ? "Accepting..." : "Accept"}
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Accepted Requests (new connections) */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 mt-12">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-black neo-heading tracking-tighter uppercase">
                  <BellIcon className="w-6 h-6 stroke-[3]" />
                  New Connections
                </h2>

                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-white border-[3px] border-black neo-shadow p-4 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={notification.recipient.profilePic}
                        alt={notification.recipient.fullName}
                        className="w-14 h-14 object-cover border-[3px] border-black neo-shadow"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black neo-heading uppercase tracking-tighter">{notification.recipient.fullName}</h3>
                        <p className="text-sm text-black font-bold uppercase mt-1">
                          {notification.recipient.fullName} accepted your friend request
                        </p>
                        <p className="text-xs text-black font-bold uppercase mt-2 flex items-center gap-1 bg-[var(--neo-pink)] border-2 border-black inline-flex px-2 py-1">
                          <ClockIcon className="w-4 h-4 stroke-[3]" />
                          Recently
                        </p>
                      </div>
                      <span className="hidden sm:flex items-center gap-1 text-xs px-3 py-1 font-bold uppercase border-2 border-black bg-[var(--neo-green)] text-black neo-shadow">
                        <MessageSquareIcon className="w-4 h-4 stroke-[3]" />
                        New Friend
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Empty state */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="bg-[var(--neo-yellow)] border-[4px] border-black neo-shadow p-12 text-center relative overflow-hidden">
                <div className="text-6xl mb-6 relative z-10">🔔</div>
                <h3 className="text-3xl font-bold text-black neo-heading uppercase tracking-tighter mb-4 relative z-10">All caught up!</h3>
                <p className="text-black font-bold uppercase text-lg border-2 border-black inline-block px-4 py-2 bg-white relative z-10">
                  No new notifications right now
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
