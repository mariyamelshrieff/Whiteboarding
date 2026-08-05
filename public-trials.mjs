import { createHmac, timingSafeEqual } from "node:crypto";

export const PUBLIC_TRIAL_LIMIT = 3;
const COOKIE_NAME = "whiteboard_public_trials";

export function validTrialId(value) {
  return /^[a-zA-Z0-9_-]{12,100}$/.test(String(value || ""));
}

function signature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function cookieValue(cookieHeader) {
  return String(cookieHeader || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1) || "";
}

export function readTrialState(cookieHeader, secret) {
  const value = cookieValue(cookieHeader);
  const [payload, suppliedSignature] = value.split(".");
  if (!payload || !suppliedSignature || !secret) return { used: [], evaluated: [] };
  const expectedSignature = signature(payload, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return { used: [], evaluated: [] };
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const used = Array.isArray(parsed.used) ? parsed.used.filter(validTrialId).slice(-PUBLIC_TRIAL_LIMIT) : [];
    const evaluated = Array.isArray(parsed.evaluated) ? parsed.evaluated.filter((id) => used.includes(id)).slice(-PUBLIC_TRIAL_LIMIT) : [];
    return { used, evaluated };
  } catch {
    return { used: [], evaluated: [] };
  }
}

export function readTrialIds(cookieHeader, secret) {
  return readTrialState(cookieHeader, secret).used;
}

export function trialAccess(cookieHeader, trialId, secret) {
  const { used, evaluated } = readTrialState(cookieHeader, secret);
  if (!validTrialId(trialId)) return { allowed: false, reason: "invalid", used, evaluated, remaining: Math.max(0, PUBLIC_TRIAL_LIMIT - used.length) };
  if (used.includes(trialId)) return { allowed: true, existing: true, used, evaluated, remaining: Math.max(0, PUBLIC_TRIAL_LIMIT - used.length) };
  if (used.length >= PUBLIC_TRIAL_LIMIT) return { allowed: false, reason: "limit", used, evaluated, remaining: 0 };
  return { allowed: true, existing: false, used, evaluated, remaining: PUBLIC_TRIAL_LIMIT - used.length };
}

export function trialCookie(used, trialId, secret, evaluated = []) {
  const next = [...new Set([...used, trialId])].slice(-PUBLIC_TRIAL_LIMIT);
  const payload = Buffer.from(JSON.stringify({ used: next, evaluated: evaluated.filter((id) => next.includes(id)) }), "utf8").toString("base64url");
  return `${COOKIE_NAME}=${payload}.${signature(payload, secret)}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;
}

export function evaluationTrialAccess(cookieHeader, trialId, secret) {
  const state = readTrialState(cookieHeader, secret);
  if (!validTrialId(trialId) || !state.used.includes(trialId)) return { allowed: false, reason: "unknown", ...state };
  if (state.evaluated.includes(trialId)) return { allowed: false, reason: "already-evaluated", ...state };
  return { allowed: true, ...state };
}

export function evaluatedTrialCookie(cookieHeader, trialId, secret) {
  const state = readTrialState(cookieHeader, secret);
  return trialCookie(state.used.filter((id) => id !== trialId), trialId, secret, [...state.evaluated, trialId]);
}
