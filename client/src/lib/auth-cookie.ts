"use client";

import type { Session } from "@/types/auth";

const COOKIE_NAME = "plantworld_auth";

export function setAuthCookie(session: Session) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=604800; samesite=lax`;
}

export function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}

export function readAuthCookie(): Session | null {
  if (typeof document === "undefined") return null;

  const matched = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));

  if (!matched) return null;

  try {
    return JSON.parse(decodeURIComponent(matched.split("=")[1]));
  } catch {
    return null;
  }
}
