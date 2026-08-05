import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PUBLIC_TRIAL_LIMIT, evaluatedTrialCookie, evaluationTrialAccess, readTrialIds, trialAccess, trialCookie } from "../public-trials.mjs";

const secret = "test-secret";
const ids = ["trial_aaaaaaaaaaaa", "trial_bbbbbbbbbbbb", "trial_cccccccccccc", "trial_dddddddddddd"];

function cookieHeader(setCookie) {
  return setCookie.split(";")[0];
}

test("allows three distinct public trials and reconnects within a trial", () => {
  let header = "";
  for (let index = 0; index < PUBLIC_TRIAL_LIMIT; index += 1) {
    const access = trialAccess(header, ids[index], secret);
    assert.equal(access.allowed, true);
    assert.equal(access.existing, false);
    header = cookieHeader(trialCookie(access.used, ids[index], secret));
  }
  const reconnect = trialAccess(header, ids[2], secret);
  assert.equal(reconnect.allowed, true);
  assert.equal(reconnect.existing, true);
  assert.equal(readTrialIds(header, secret).length, 3);
});

test("blocks a fourth trial and rejects a tampered trial cookie", () => {
  let header = "";
  for (const id of ids.slice(0, 3)) {
    const access = trialAccess(header, id, secret);
    header = cookieHeader(trialCookie(access.used, id, secret));
  }
  assert.equal(trialAccess(header, ids[3], secret).reason, "limit");
  assert.deepEqual(readTrialIds(`${header}tampered`, secret), []);
});

test("allows only one model evaluation for each signed trial", () => {
  const header = cookieHeader(trialCookie([], ids[0], secret));
  assert.equal(evaluationTrialAccess(header, ids[0], secret).allowed, true);
  const evaluated = cookieHeader(evaluatedTrialCookie(header, ids[0], secret));
  assert.equal(evaluationTrialAccess(evaluated, ids[0], secret).reason, "already-evaluated");
  assert.equal(evaluationTrialAccess(evaluated, ids[1], secret).reason, "unknown");
});

test("shows intentional credit and trial-limit messages", async () => {
  const server = await readFile(new URL("../server.mjs", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(server, /PUBLIC_CREDITS_EXHAUSTED/);
  assert.match(server, /used all \$\{PUBLIC_TRIAL_LIMIT\} free interview trials/);
  assert.match(app, /trialId: state\.publicTrialId/);
  assert.match(app, /public AI interview credits are temporarily used up/);
});
