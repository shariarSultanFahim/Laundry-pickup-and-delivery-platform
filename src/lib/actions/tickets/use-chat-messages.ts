"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import type { GetChatMessagesResponse } from "@/types/ticket-management";

import { api } from "@/lib/api";

const MESSAGES_PER_PAGE = 10;

export const useInfiniteChatMessages = (roomId: string | null | undefined, enabled = true) => {
  return useInfiniteQuery({
    queryKey: ["chat-messages", roomId],
    enabled: enabled && !!roomId,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<GetChatMessagesResponse>(`/chatroom/${roomId}/messages`, {
        params: {
          limit: MESSAGES_PER_PAGE,
          page: pageParam
        }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPage } = lastPage.meta;
      return page < totalPage ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.meta;
      return page > 1 ? page - 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages,
      pageParams: data.pageParams
    })
  });
};
