import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set
const client = new MongoClient(uri);

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("Auction");
};

export default async function handler(req, res) {
  const { userId } = req.query; // `query` contains dynamic route segments

  if (req.method === "GET") {
    try {
      console.log("Fetching user with ID:", userId);
      const db = await getDatabase();
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      console.log("Updating user with ID:", userId);
      const db = await getDatabase();
      const usersCollection = db.collection("users");

      const { firstName, lastName, generalLocation, phoneNumber } = req.body;

      const result = await usersCollection.updateOne(
        { auth0Id: userId },
        {
          $set: {
            firstName,
            lastName,
            generalLocation,
            phoneNumber,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
