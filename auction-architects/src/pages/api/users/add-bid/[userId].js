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

      const { carId } = req.body;

      // Retrieve the user's current userBids array
      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentUserBids = user.userBids || [];

      // Add the carId to the userBids array if it's not already present
      const updatedUserBids = currentUserBids.includes(carId)
        ? currentUserBids
        : [...currentUserBids, carId];

      const result = await usersCollection.updateOne(
        { auth0Id: userId },
        {
          $set: { userBids: updatedUserBids },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User bids updated successfully",
        userBids: updatedUserBids,
      });
    } catch (error) {
      console.error("Error updating user bids:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
