export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function decodeJWT<T = any>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    const base = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = decodeJWT<{ exp?: number }>(token);
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}
