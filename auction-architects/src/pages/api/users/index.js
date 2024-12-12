import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set
const client = new MongoClient(uri);

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("Auction");
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection("users");

      // Fetch all users
      const users = await usersCollection.find({}).toArray();

      // Return all users in JSON format
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Only allow GET requests
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
