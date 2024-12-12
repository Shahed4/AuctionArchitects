import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set
const client = new MongoClient(uri);

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("Auction");
};

export default async function handler(req, res) {
  const { userId } = req.query; // `query` contains dynamic route segments

  if (req.method === "POST") {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection("users");

      const { message, rating, reviewerId } = req.body;

      if (!message || !rating || !reviewerId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Find the user by auth0Id
      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Add the review object to the user's reviews array
      const review = { message, rating, reviewerId, date: new Date() };

      const result = await usersCollection.updateOne(
        { auth0Id: userId },
        {
          $push: { reviews: review },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Review added successfully", review });
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
