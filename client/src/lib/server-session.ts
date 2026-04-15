import { cookies } from "next/headers";

import type { Session } from "@/types/auth";

const COOKIE_NAME = "plantworld_auth";

export async function readServerSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(raw)) as Session;
  } catch {
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  }
}
