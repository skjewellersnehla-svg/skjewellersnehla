import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";

const ADMIN_PHONE = "+919896102704";
const ADMIN_PIN = "989610";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const sessions = new Map<string, number>();

export function createAdminSession(phone: string, pin: string) {
  if (phone !== ADMIN_PHONE || pin !== ADMIN_PIN) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiresAt);
  return { token, expiresAt: new Date(expiresAt).toISOString() };
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  const expiresAt = sessions.get(token);

  if (!expiresAt || expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    res.status(401).json({ error: "Admin session required" });
    return;
  }

  next();
};