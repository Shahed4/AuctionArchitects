import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  // During build time, MONGODB_URI might not be available
  // Create a promise that will reject when actually used
  clientPromise = Promise.reject(
    new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    )
  );
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the client across hot reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, always create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
