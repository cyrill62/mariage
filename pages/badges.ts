const badgeColors = ["primary", "secondary", "accent", "info", "warning", "success"];
const badgeVariants = ["outline", "dash", ""];

const randomSelect = (givenName: string, options: readonly string[]): string | undefined => {
  if (!Array.isArray(options) || options.length === 0) return undefined;

  // 1️⃣ Hash the given name to a deterministic 32-bit seed (FNV-1a algorithm)
  let seed = 0x811c9dc5;
  for (let i = 0; i < givenName.length; i++) {
    seed ^= givenName.charCodeAt(i);
    seed = Math.imul(seed, 0x01000193); // 32-bit multiplication with overflow
  }
  const initialSeed = seed >>> 0;

  // 2️⃣ Seeded PRNG (Mulberry32) - generates a predictable sequence from the seed
  let state = initialSeed;
  function nextRandom(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // 3️⃣ Map the random value to an array index
  const index = Math.floor(nextRandom() * options.length);
  return options[index];
};

export const badgeColor = (name: string): string | undefined => randomSelect(name, badgeColors);
export const badgeVariant = (name: string): string | undefined => randomSelect(name, badgeVariants);
export const badgeColored = (name: string): string => `badge badge-${badgeVariant(name)} badge-${badgeColor(name)}`;
