import clientPromise from "../../../../../lib/mongodb";

export default async function handler(req, res) {
  const { userId } = req.query; // Extract `userId` from the query parameters
  const { action } = req.body; // "suspend" or "unsuspend"

  if (req.method === "PATCH") {
    try {
      // Validate `userId`
      if (!userId || typeof userId !== "string" || userId.trim() === "") {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const client = await clientPromise;
      const db = client.db("Auction");

      // Retrieve the user using `auth0Id`
      const user = await db.collection("users").findOne({ auth0Id: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (action === "suspend") {
        // Check if the user is already suspended
        if (user.isSuspended) {
          return res.status(400).json({ error: "User is already suspended" });
        }

        // Update the user's suspension status
        const result = await db.collection("users").updateOne(
          { auth0Id: userId },
          {
            $set: { isSuspended: true },
            $inc: { numSuspensions: 1 }, // Increment `numSuspensions`
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(500).json({ error: "Failed to suspend user" });
        }

        // Fetch the updated user from the database
        const updatedUser = await db.collection("users").findOne({ auth0Id: userId });

        return res.status(200).json({
          message: "User suspended successfully",
          user: updatedUser,
        });
      } else if (action === "unsuspend") {
        // Check if the user is already unsuspended
        if (!user.isSuspended) {
          return res.status(400).json({ error: "User is already unsuspended" });
        }

        // Update the user's suspension status to unsuspended
        const result = await db.collection("users").updateOne(
          { auth0Id: userId },
          {
            $set: { isSuspended: false },
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(500).json({ error: "Failed to unsuspend user" });
        }

        // Fetch the updated user from the database
        const updatedUser = await db.collection("users").findOne({ auth0Id: userId });

        return res.status(200).json({
          message: "User unsuspended successfully",
          user: updatedUser,
        });
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }
    } catch (error) {
      console.error("Error updating suspension:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]); // Restrict to `PATCH` method
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}
