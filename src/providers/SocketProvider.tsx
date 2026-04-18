"use client";

import { createContext, ReactNode, useContext } from "react";

import { Socket } from "socket.io-client";

import { getSocket } from "@/lib/socket";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  return (
    <SocketContext.Provider value={{ socket: getSocket() }}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context.socket;
};
