import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    await client.connect();
    const db = client.db("Auction");
    const usersCollection = db.collection("user");

    if (req.method === "GET") {
      // Fetch user data
      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } else if (req.method === "POST") {
      // Update user data
      const { address, phone } = req.body;
      const updateResult = await usersCollection.updateOne(
        { auth0Id: userId },
        { $set: { address, phone } },
        { upsert: true }
      );
      res.status(200).json({ success: true, updateResult });
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in user API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
}
