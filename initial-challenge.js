(() => {
  const shuffleButton = globalThis.document?.querySelector?.("#shuffleChallenge");
  if (!shuffleButton) return;

  // Reuse the same eligibility and resume guards as the visible Shuffle control.
  // The script runs in the same browser task as app initialization, before the
  // initial challenge is painted, so a fresh visit begins on a random prompt.
  shuffleButton.click();
})();
