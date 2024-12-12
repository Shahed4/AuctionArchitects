import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Ensure this is correctly set
const client = new MongoClient(uri);

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("Auction");
};

const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
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

      // Check the updated user's reviews
      const updatedUser = await usersCollection.findOne({ auth0Id: userId });
      const averageRating = calculateAverageRating(updatedUser.reviews);

      if (updatedUser.reviews.length >= 3 && averageRating <= 2) {
        // Suspend the user
        const suspensionResult = await usersCollection.updateOne(
          { auth0Id: userId },
          {
            $set: { isSuspended: true }, // Set suspended flag
            $inc: { numSuspensions: 1 }, // Increment suspension count
          }
        );

        if (suspensionResult.modifiedCount > 0) {
          console.log(`User ${userId} has been suspended.`);
        }
      }

      return res.status(200).json({
        message: "Review added successfully",
        review,
        userSuspended: updatedUser.isSuspended || false,
        numSuspensions: updatedUser.numSuspensions || 0,
      });
    } catch (error) {
      console.error("Error adding review:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }
}

// Suspend Style Component Example for Frontend
export function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      {user.isSuspended ? (
        <p style={{ color: "red", fontWeight: "bold" }}>
          This profile is suspended.
        </p>
      ) : (
        <p style={{ color: "green" }}>This profile is active.</p>
      )}

      <h2>Suspension Count:</h2>
      <p>{user.numSuspensions || 0} suspension(s)</p>

      <h2>Reviews:</h2>
      <ul>
        {user.reviews.map((review, index) => (
          <li key={index}>
            <p>
              <strong>Rating:</strong> {review.rating}
            </p>
            <p>
              <strong>Message:</strong> {review.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
