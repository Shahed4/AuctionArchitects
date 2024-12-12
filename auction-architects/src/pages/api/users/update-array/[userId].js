import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
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

      const { carId, actionType } = req.body;

      if (!["userBids", "userListings"].includes(actionType)) {
        return res.status(400).json({ error: "Invalid actionType" });
      }

      // Retrieve the user's current array for the specified action type
      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentArray = user[actionType] || [];

      // Add the carId to the array if it's not already present
      const updatedArray = currentArray.includes(carId)
        ? currentArray
        : [...currentArray, carId];

      const result = await usersCollection.updateOne(
        { auth0Id: userId },
        {
          $set: { [actionType]: updatedArray },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: `${actionType} updated successfully`,
        [actionType]: updatedArray,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
