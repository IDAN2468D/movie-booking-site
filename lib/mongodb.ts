import { MongoClient } from 'mongodb';

// Environment variable check moved to clientPromise initialization to avoid top-level crashes


const uri = process.env.MONGODB_URI;
const options = {};

if (process.env.NODE_ENV === 'development') {
  console.log('--- Env Debug ---');
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('All Env Keys:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('SECRET')));
  console.log('-----------------');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // In development, we don't want to crash the whole app with an unhandled rejection
  // if the URI is missing during module evaluation or static build phases.
  clientPromise = new Promise((_, reject) => {
    if (typeof window === 'undefined') {
      console.warn('⚠️ MONGODB_URI is missing. Database dependent features will fail.');
    }
    // We don't reject immediately to avoid global unhandledRejection
  });
} else {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
