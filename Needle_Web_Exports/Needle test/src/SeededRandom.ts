export class SeededRandom {
    private seed: number;
    private readonly a: number = 1664525;
    private readonly c: number = 1013904223;
    private readonly m: number = 2 ** 32;
  
    constructor(seed: number) {
      this.seed = seed;
    }
  
    // Generates a pseudo-random integer
    public randomInt(): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return this.seed;
    }
  
    // Generates a pseudo-random integer within a specified range [min, max]
    public randomInRange(min: number, max: number): number {
      // Ensure the output is within [0, 1)
      const randomNumber = this.randomInt() / this.m;
      // Scale the number to the desired range and round it to get an integer
      return Math.floor(min + randomNumber * (max - min + 1));
    }
  }
  
  // Usage:
  const seed: number = Date.now(); // Example seed
  const rnd: SeededRandom = new SeededRandom(seed);
  
  // Generate a pseudo-random integer within a range [10, 50]
  console.log(rnd.randomInRange(10, 50));
  