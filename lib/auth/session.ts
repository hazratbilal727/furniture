import { createHmac, timingSafeEqual } from "node:crypto";
import {
  authCookieName,
  getAuthSecret,
  sessionDurationSeconds,
} from "./config";

type SessionPayload = {
  sub: "admin";
  email: string;
  exp: number;
};

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

export function createSessionToken(email: string) {
  const payload: SessionPayload = {
    sub: "admin",
    email,
    exp: Math.floor(Date.now() / 1000) + sessionDurationSeconds,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readSessionToken(
  token: string | undefined,
): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  )
    return null;

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload;
    if (
      payload.sub !== "admin" ||
      typeof payload.email !== "string" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    )
      return null;
    return payload;
  } catch {
    return null;
  }
}

export { authCookieName, sessionDurationSeconds };
