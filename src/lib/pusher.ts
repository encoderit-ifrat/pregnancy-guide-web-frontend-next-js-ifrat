import Pusher from "pusher-js";

const PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const PUSHER_APP_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

let pusherInstance: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherInstance) {
    if (!PUSHER_APP_KEY || !PUSHER_APP_CLUSTER) {
      throw new Error(
        "Pusher app key and cluster are required. Please set NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER in your environment variables."
      );
    }
    pusherInstance = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
    });
  }
  return pusherInstance;
};

export const PUSHER_EVENTS = {
  NEW_THREAD: "new-thread",
  THREAD_DELETED: "thread-deleted",
  THREAD_LIKED: "thread-liked",
  NEW_REPLY: "new-reply",
  REPLY_LIKED: "reply-liked",
  REPLY_DELETED: "reply-deleted",
} as const;

export const PUSHER_CHANNELS = {
  THREADS: "threads",
  THREAD_PREFIX: "thread-",
} as const;
