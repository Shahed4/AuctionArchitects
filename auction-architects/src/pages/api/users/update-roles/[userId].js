import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set
const client = new MongoClient(uri);

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("Auction");
};

export default async function handler(req, res) {
  const { userId } = req.query; // `query` contains dynamic route segments

  if (req.method === "PUT") {
    try {
      const db = await getDatabase();
      const usersCollection = db.collection("users");

      const { role } = req.body;

      // Retrieve the user's current roles
      const user = await usersCollection.findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentRoles = user.roles || [];

      // Add "seller" to the roles array if it's not already present
      const updatedRoles = currentRoles.includes(role)
        ? currentRoles
        : [...currentRoles, role];

      const result = await usersCollection.updateOne(
        { auth0Id: userId },
        {
          $set: { roles: updatedRoles },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", roles: updatedRoles });
    } catch (error) {
      console.error("Error updating user roles:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
