export function sleep(ms: number): Promise<{}> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns a random integer in range [min,max)
 * @param min Lower bound of the range (inclusive) 
 * @param max Upper bound of the range (exclusive)
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; 
}
