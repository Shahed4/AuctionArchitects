import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

function getClientPromise() {
  const currentUri = process.env.MONGODB_URI;
  if (!currentUri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the client across hot reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(currentUri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, always create a new client
    client = new MongoClient(currentUri, options);
    return client.connect();
  }
}

// Only initialize if URI is available (skip during build if not set)
if (uri) {
  clientPromise = getClientPromise();
} else {
  // Create a promise that will be resolved lazily when accessed
  clientPromise = new Promise((resolve, reject) => {
    // This will only execute when the promise is actually awaited
    process.nextTick(() => {
      try {
        resolve(getClientPromise());
      } catch (error) {
        reject(error);
      }
    });
  });
}

export default clientPromise;
