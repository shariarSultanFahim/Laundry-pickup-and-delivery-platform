"use client";

import Cookies from "js-cookie";

const isClient = () => typeof window !== "undefined";

export const cookie = {
  get: (key: string): string | null => (isClient() ? (Cookies.get(key) ?? null) : null),

  set: (key: string, value: string, days = 365): void => {
    if (!isClient()) return;
    Cookies.set(key, value, {
      expires: days,
      sameSite: "Lax",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    });
  },

  remove: (key: string): void => {
    if (!isClient()) return;
    Cookies.remove(key);
  }
};
