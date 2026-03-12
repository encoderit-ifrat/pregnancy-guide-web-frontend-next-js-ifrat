"use client";

import { useEffect, useRef } from "react";
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
  onThreadLiked?: ThreadCallback<PusherThreadLikedEvent>;
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
  onThreadLiked,
}: UsePusherThreadsSubscriptionOptions) {
  const onNewThreadRef = useRef(onNewThread);
  const onThreadDeletedRef = useRef(onThreadDeleted);
  const onThreadLikedRef = useRef(onThreadLiked);

  useEffect(() => {
    onNewThreadRef.current = onNewThread;
  }, [onNewThread]);

  useEffect(() => {
    onThreadDeletedRef.current = onThreadDeleted;
  }, [onThreadDeleted]);

  useEffect(() => {
    onThreadLikedRef.current = onThreadLiked;
  }, [onThreadLiked]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNELS.THREADS);

    channel.bind(PUSHER_EVENTS.NEW_THREAD, (data: PusherNewThreadEvent) => {
      onNewThreadRef.current?.(data);
    });

    channel.bind(
      PUSHER_EVENTS.THREAD_DELETED,
      (data: PusherThreadDeletedEvent) => {
        onThreadDeletedRef.current?.(data);
      }
    );

    channel.bind(PUSHER_EVENTS.THREAD_LIKED, (data: PusherThreadLikedEvent) => {
      onThreadLikedRef.current?.(data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(PUSHER_CHANNELS.THREADS);
    };
  }, []);
}

export function usePusherThreadDetailSubscription({
  threadId,
  onThreadLiked,
  onNewReply,
  onReplyLiked,
  onReplyDeleted,
}: UsePusherThreadDetailSubscriptionOptions) {
  const channelName = `${PUSHER_CHANNELS.THREAD_PREFIX}${threadId}`;

  const onThreadLikedRef = useRef(onThreadLiked);
  const onNewReplyRef = useRef(onNewReply);
  const onReplyLikedRef = useRef(onReplyLiked);
  const onReplyDeletedRef = useRef(onReplyDeleted);

  useEffect(() => {
    onThreadLikedRef.current = onThreadLiked;
  }, [onThreadLiked]);

  useEffect(() => {
    onNewReplyRef.current = onNewReply;
  }, [onNewReply]);

  useEffect(() => {
    onReplyLikedRef.current = onReplyLiked;
  }, [onReplyLiked]);

  useEffect(() => {
    onReplyDeletedRef.current = onReplyDeleted;
  }, [onReplyDeleted]);

  useEffect(() => {
    if (!threadId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(channelName);

    channel.bind(PUSHER_EVENTS.THREAD_LIKED, (data: PusherThreadLikedEvent) => {
      onThreadLikedRef.current?.(data);
    });

    channel.bind(PUSHER_EVENTS.NEW_REPLY, (data: PusherNewReplyEvent) => {
      onNewReplyRef.current?.(data);
    });

    channel.bind(PUSHER_EVENTS.REPLY_LIKED, (data: PusherReplyLikedEvent) => {
      onReplyLikedRef.current?.(data);
    });

    channel.bind(
      PUSHER_EVENTS.REPLY_DELETED,
      (data: PusherReplyDeletedEvent) => {
        onReplyDeletedRef.current?.(data);
      }
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [threadId, channelName]);
}
