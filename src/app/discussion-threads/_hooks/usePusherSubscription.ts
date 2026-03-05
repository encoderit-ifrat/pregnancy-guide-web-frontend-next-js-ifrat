"use client";

import { useEffect, useCallback } from "react";
import Pusher from "pusher-js";
import { getPusherClient, PUSHER_CHANNELS, PUSHER_EVENTS } from "@/lib/pusher";
import {
  PusherNewThreadEvent,
  PusherThreadDeletedEvent,
  PusherThreadLikedEvent,
  PusherNewReplyEvent,
  PusherReplyLikedEvent,
  PusherReplyDeletedEvent,
} from "../_types/thread_types";

type ThreadCallback<T> = (data: T) => void;

interface UsePusherThreadsSubscriptionOptions {
  onNewThread?: ThreadCallback<PusherNewThreadEvent>;
  onThreadDeleted?: ThreadCallback<PusherThreadDeletedEvent>;
}

interface UsePusherThreadDetailSubscriptionOptions {
  threadId: string;
  onThreadLiked?: ThreadCallback<PusherThreadLikedEvent>;
  onNewReply?: ThreadCallback<PusherNewReplyEvent>;
  onReplyLiked?: ThreadCallback<PusherReplyLikedEvent>;
  onReplyDeleted?: ThreadCallback<PusherReplyDeletedEvent>;
}

export function usePusherThreadsSubscription({
  onNewThread,
  onThreadDeleted,
}: UsePusherThreadsSubscriptionOptions) {
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNELS.THREADS);

    if (onNewThread) {
      channel.bind(PUSHER_EVENTS.NEW_THREAD, onNewThread);
    }

    if (onThreadDeleted) {
      channel.bind(PUSHER_EVENTS.THREAD_DELETED, onThreadDeleted);
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(PUSHER_CHANNELS.THREADS);
    };
  }, [onNewThread, onThreadDeleted]);
}

export function usePusherThreadDetailSubscription({
  threadId,
  onThreadLiked,
  onNewReply,
  onReplyLiked,
  onReplyDeleted,
}: UsePusherThreadDetailSubscriptionOptions) {
  const channelName = `${PUSHER_CHANNELS.THREAD_PREFIX}${threadId}`;

  useEffect(() => {
    if (!threadId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);

    if (onThreadLiked) {
      channel.bind(PUSHER_EVENTS.THREAD_LIKED, onThreadLiked);
    }

    if (onNewReply) {
      channel.bind(PUSHER_EVENTS.NEW_REPLY, onNewReply);
    }

    if (onReplyLiked) {
      channel.bind(PUSHER_EVENTS.REPLY_LIKED, onReplyLiked);
    }

    if (onReplyDeleted) {
      channel.bind(PUSHER_EVENTS.REPLY_DELETED, onReplyDeleted);
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [
    threadId,
    channelName,
    onThreadLiked,
    onNewReply,
    onReplyLiked,
    onReplyDeleted,
  ]);
}
