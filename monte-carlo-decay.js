// monte-carlo-decay.js
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
  ],
  // Added antimatter counterparts:
  "Anti-Electron": [
    { products: ["Photon", "Photon"], probability: 1.0 } // example decay channel for Anti-Electron (positron)
  ],
  "Anti-Muon": [
    { products: ["Photon", "Neutrino"], probability: 1.0 } // example decay channel
  ],
  "Anti-Muon": [
    { products: ["Photon", "Neutrino"], probability: 1.0 }
  ],
  "Anti-Neutrino": [
    // Often considered stable, no decay
  ],
  "Anti-Proton": [
    { products: ["Anti-Higgs"], probability: 0.01 }, // hypothetical antimatter equivalent
    { products: ["Anti-Pion+", "Anti-Pion-"], probability: 0.1 },
  ],
  "Anti-Higgs": [
    { products: ["Photon", "Photon"], probability: 1.0 } // antimatter Higgs behaves same as Higgs here
  ],
  "Anti-Pion+": [
    { products: ["Anti-Muon", "Anti-Neutrino"], probability: 1.0 }
  ],
  "Anti-Pion-": [
    { products: ["Muon", "Neutrino"], probability: 1.0 }
  ],
  // For neutrinos and photons assume stable:
  "Photon": [],  
  "Electron": [],  
  "Muon": [],  
  "Neutrino": [],
};


// Helper to pick decay channel randomly according to probabilities
function pickDecayChannel(channels) {
  const r = Math.random();
  let cumulative = 0;
  for (const channel of channels) {
    cumulative += channel.probability;
    if (r <= cumulative) {
      return channel.products;
    }
  }
  return null; // No decay or stable
}

window.decayParticle = function(particle) {
  console.log("decayParticle called on:", particle);
  const decays = PARTICLE_DECAYS[particle.name];
  if (!decays) {
    // No decay info - stable particle
    return null;
  }

  const products = pickDecayChannel(decays);
  if (!products) {
    // No decay this time
    return null;
  }

  // Create new particle objects for each product
  return products.map(productName => {
    // Assign a color for new particles (simple hash or default)
    const colorMap = {
      "Higgs": "#f0f",
      "Photon": "#fff",
      "Z Boson": "#ccc",
      "W Boson": "#999",
      "Muon": "#0ff",
      "Anti-Muon": "#0cc",
      "Electron": "#00f",
      "Neutrino": "#666",
      "Anti-Neutrino": "#444",
      "Pion+": "#f80",
      "Pion-": "#f44"
    };
    return {
      x: particle.x + (Math.random() - 0.5) * 20,
      y: particle.y + (Math.random() - 0.5) * 20,
      r: Math.max(particle.r / 2, 4),
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      beam: particle.beam,
      color: colorMap[productName] || '#aaa',
      decayed: false,
      name: productName
    };
  });
};

// Optional: simulate entire decay chain, recursively decaying products until stable
window.simulateDecayChain = function(initialParticle) {
  const queue = [initialParticle];
  const stableParticles = [];

  while (queue.length > 0) {
    const particle = queue.shift();
    const decayProducts = window.decayParticle(particle);
    if (decayProducts && decayProducts.length > 0) {
      queue.push(...decayProducts);
    } else {
      stableParticles.push(particle);
    }
  }

  return stableParticles;
};
