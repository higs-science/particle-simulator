// monte-carlo-decay.js

// Basic particle database with decay chains (simplified)
const PARTICLE_DECAYS = {
  "Proton": [
    { products: ["Higgs"], probability: 0.01 },
    { products: ["Pion+", "Pion-"], probability: 0.1 },
  ],
  "Higgs": [
    { products: ["Photon", "Photon"], probability: 0.7 },
    { products: ["Z Boson", "Z Boson"], probability: 0.2 },
    { products: ["W Boson", "W Boson"], probability: 0.1 },
  ],
  "Z Boson": [
    { products: ["Muon", "Anti-Muon"], probability: 1.0 }
  ],
  "W Boson": [
    { products: ["Electron", "Neutrino"], probability: 0.5 },
    { products: ["Muon", "Neutrino"], probability: 0.5 }
  ],
  "Pion+": [
    { products: ["Muon", "Neutrino"], probability: 1.0 }
  ],
  "Pion-": [
    { products: ["Anti-Muon", "Anti-Neutrino"], probability: 1.0 }
  ]
};

export function decayParticle(particleName) {
  const decays = PARTICLE_DECAYS[particleName];
  if (!decays) return null; // Stable particle or unknown

  const rand = Math.random();
  let sum = 0;
  for (const decay of decays) {
    sum += decay.probability;
    if (rand <= sum) {
      return decay.products;
    }
  }
  return null; // No decay selected (shouldn't happen)
}

// Simulate decay chain
export function simulateDecayChain(initialParticle) {
  const queue = [initialParticle];
  const result = [];

  while (queue.length > 0) {
    const particle = queue.shift();
    const products = decayParticle(particle);
    if (products) {
      queue.push(...products);
    } else {
      result.push(particle); // Stable
    }
  }

  return result; // All stable particles
}
