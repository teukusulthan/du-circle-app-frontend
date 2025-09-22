import { useEffect } from "react";
import { createSocket } from "../utils/socket";
import type { Thread } from "../types/thread";

export function useThreadsRealtime(
  token: string,
  onIncoming: (t: Thread) => void
) {
  useEffect(() => {
    if (!token) return;

    const socket = createSocket(token);

    socket.on("thread:created", (p: any) => {
      const t: Thread = {
        id: Number(p.id),
        user: p.user,
        content: p.content,
        image: p.image_url,
        created_at: p.timestamp,
        likes: 0,
        isLiked: false,
        reply: 0,
      };
      onIncoming(t);
    });

    return () => {
      socket.off("thread:created");
      socket.disconnect();
    };
  }, [token, onIncoming]);
}
