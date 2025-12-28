
let seed = Math.floor(Date.now() / 1000);

export function seededRandom(min = 0, max = 1) {
  // Linear Congruential Generator (LCG)
  seed = (seed * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  return min + rnd * (max - min);
}

export function resetSeed(newSeed: number) {
  seed = newSeed;
}
