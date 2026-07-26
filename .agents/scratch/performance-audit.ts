import { calculateDynamicPrice, getPriceInsights } from '../lib/utils/pricing-engine';

const ITERATIONS = 10000;

function audit() {
  console.log('--- Dynamic Pricing Performance Audit ---');
  
  const factors = {
    basePrice: 45.00,
    occupancyRate: 0.85,
    isWeekend: true,
    daysUntilShow: 2,
    isPrimeTime: true
  };

  const start = performance.now();
  
  for (let i = 0; i < ITERATIONS; i++) {
    calculateDynamicPrice(factors);
    getPriceInsights(factors);
  }

  const end = performance.now();
  const totalTime = end - start;
  const averageTime = totalTime / ITERATIONS;

  console.log(`Total iterations: ${ITERATIONS}`);
  console.log(`Total time: ${totalTime.toFixed(4)}ms`);
  console.log(`Average time per calculation: ${averageTime.toFixed(6)}ms`);
  
  if (averageTime < 0.1) {
    console.log('Status: EXCELLENT (Sub-millisecond latency)');
  } else if (averageTime < 1.0) {
    console.log('Status: GOOD (Acceptable latency)');
  } else {
    console.log('Status: WARNING (Performance optimization recommended)');
  }
}

audit();
