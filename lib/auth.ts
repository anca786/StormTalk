export const DEMO_SESSION_STORAGE_KEY = "stormtalk-demo-session";

export type DemoSession = {
  email: string;
  name: string;
  mode: "demo";
};

export function readDemoSession(storageValue: string | null): DemoSession | null {
  if (!storageValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(storageValue) as DemoSession;

    if (parsed?.email && parsed?.name) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
