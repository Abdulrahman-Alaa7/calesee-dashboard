"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { format } from "timeago.js";
import { useMutation, useQuery } from "@apollo/client";
import io from "socket.io-client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import MainLoading from "./ui/main-loading";
import { Bell, CheckCheck, ShoppingBag, Trash2, Star } from "lucide-react";
import { GET_NOTIFICATIONS } from "../graphql/actions/queries/notification/getNotifications";
import { GET_ORDERS } from "../graphql/actions/queries/orders/getOrders";
import { GET_RECENT_ORDERS } from "../graphql/actions/queries/analysis/getRecntOrders";
import { MARK_ALL_NOTIFICATION } from "@/graphql/actions/mutations/notification/markAllNotificationsAsRead";
import { DELETE_NOTIFICATION } from "@/graphql/actions/mutations/notification/deleteNotification";
import { DELETE_ALL_NOTIFICATIONS } from "@/graphql/actions/mutations/notification/deleteAllNotifications";
import { MARK_NOTIFICATION } from "@/graphql/actions/mutations/notification/updateNotification";
import { useApolloClient } from "@apollo/client";
import { GET_REVIEWS_BY_ID } from "@/graphql/actions/queries/reviews/getReviews";

let socket: any;

type NotificationType = {
  id: string;
  message: string;
  theId: string;
  status: boolean;
  createdAt: string;
};

const Notifications = () => {
  const apolloClient = useApolloClient();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const {
    data,
    loading,
    refetch: refetchNotifications,
  } = useQuery(GET_NOTIFICATIONS);

  useEffect(() => {
    if (data?.getNotifications) {
      setNotifications(data.getNotifications);
    }
  }, [data?.getNotifications]);

  const [markNotification, { loading: markNotiLoading }] =
    useMutation(MARK_NOTIFICATION);

  const [markAllNotification, { loading: markAllNotiLoading }] = useMutation(
    MARK_ALL_NOTIFICATION,
  );

  const [deleteNotification, { loading: deleteNotiLoading }] =
    useMutation(DELETE_NOTIFICATION);

  const [deleteReadNotificationsMutation, { loading: deleteAllNotiLoading }] =
    useMutation(DELETE_ALL_NOTIFICATIONS);

  const refetchOrdersData = useCallback(async () => {
    await apolloClient.refetchQueries({
      include: [GET_ORDERS, GET_RECENT_ORDERS],
    });
  }, [apolloClient]);

  useEffect(() => {
    const audioElement = document.getElementById(
      "notification_sound",
    ) as HTMLAudioElement | null;

    if (!process.env.NEXT_PUBLIC_SOCKET_SERVER_URL) return;

    socket = io(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

    socket.on("newNotification", (newNotification: NotificationType) => {
      setNotifications((prev) => [newNotification, ...prev]);
      refetchNotifications();
      const isReview = newNotification.message.toLowerCase().includes("review");

      if (isReview) {
        void apolloClient.query({
          query: GET_REVIEWS_BY_ID,
          variables: { productId: newNotification.theId },
          fetchPolicy: "network-only",
        });
      } else {
        refetchOrdersData();
      }

      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement
          .play()
          .catch((error) => console.error("Failed to play audio:", error));
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [refetchNotifications, refetchOrdersData, apolloClient]);

  const unReadCount = notifications.filter((n) => !n.status).length;

  const commonRefetch = async () => {
    await Promise.all([refetchNotifications(), refetchOrdersData()]);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotification({
        variables: { id },
      });

      toast.success("Notification marked as read successfully");
      await commonRefetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotification();
      toast.success("All notifications marked as read successfully");
      await commonRefetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification({
        variables: { id },
      });

      toast.success("Notification deleted successfully");
      await commonRefetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete notification");
    }
  };

  const handleDeleteReadNotifications = async () => {
    try {
      await deleteReadNotificationsMutation();
      toast.success("Read notifications deleted successfully");
      await commonRefetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete read notifications");
    }
  };

  const isActionLoading =
    markNotiLoading ||
    markAllNotiLoading ||
    deleteNotiLoading ||
    deleteAllNotiLoading;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative inline-flex h-10 items-center justify-center rounded-full border border-input bg-background px-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          {unReadCount > 0 && (
            <span className="absolute -right-2 -top-[6px] flex min-h-[18px] min-w-[22px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white shadow-md animate-[fadeIn_0.2s_ease-out]">
              {unReadCount}
            </span>
          )}
          <Bell size={20} />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="my-2 w-[360px] translate-y-1 rounded-2xl border bg-popover/95 p-0 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <DropdownMenuLabel className="text-base font-semibold">
              Notifications
            </DropdownMenuLabel>

            {loading ? null : (
              <div className="flex items-center gap-2">
                {unReadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={handleMarkAllAsRead}
                    disabled={isActionLoading}
                  >
                    {markAllNotiLoading ? (
                      <MainLoading />
                    ) : (
                      <>
                        <CheckCheck className="mr-1 h-3 w-3" />
                        Mark all as read
                      </>
                    )}
                  </Button>
                )}

                {notifications.some((n) => n.status === true) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                    onClick={handleDeleteReadNotifications}
                    disabled={isActionLoading}
                    title="Delete read notifications"
                  >
                    {deleteAllNotiLoading ? (
                      <MainLoading />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          <DropdownMenuSeparator />

          <ScrollArea className="h-[360px] px-2 pb-2 pt-1">
            {loading ? (
              <div className="mt-10 flex flex-col items-center justify-center">
                <MainLoading />
              </div>
            ) : notifications.length === 0 ? (
              <div className="mt-10 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Bell size={40} className="mb-2 opacity-40" />
                <p className="text-sm">Your notifications live here</p>
                <p className="text-xs">
                  You&apos;ll see new updates and orders in this space.
                </p>
              </div>
            ) : (
              notifications.map((noti, index) => {
                const isUnread = !noti.status;

                const isReview = noti.message.toLowerCase().includes("review");

                const href = isReview
                  ? `/dashboard/products/${noti.theId}/reviews`
                  : `/dashboard/orders/${noti.theId}`;

                const key = noti.id || `notification-${index}`;

                return (
                  <React.Fragment key={key}>
                    <Link key={noti.id} href={href}>
                      <DropdownMenuItem
                        className={`my-2 flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-all duration-200 hover:bg-muted/80 ${
                          isUnread ? "bg-secondary/70" : "bg-background"
                        }`}
                      >
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                          {isReview ? (
                            <Star className="h-5 w-5" />
                          ) : (
                            <ShoppingBag className="h-5 w-5" />
                          )}
                          {isUnread && (
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
                          )}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`line-clamp-2 text-[13px] ${
                              isUnread ? "font-semibold" : "font-medium"
                            }`}
                          >
                            {noti.message}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-4">
                            <p className="text-[11px] text-muted-foreground">
                              {format(noti.createdAt)}
                            </p>

                            <div className="flex items-center gap-2">
                              {isUnread && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 rounded-full px-2 text-[11px]"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleMarkAsRead(noti.id);
                                  }}
                                  disabled={isActionLoading}
                                >
                                  <CheckCheck className="mr-1 h-3 w-3" />
                                  Mark as read
                                </Button>
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                                onClick={(event) => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  handleDeleteNotification(noti.id);
                                }}
                                disabled={isActionLoading}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  </React.Fragment>
                );
              })
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <audio
        id="notification_sound"
        src="/assets/notification-sound.mp3"
        preload="auto"
      />
    </div>
  );
};

export default Notifications;
