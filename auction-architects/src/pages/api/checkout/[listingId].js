import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { listingId } = req.query; // Get listingId from the URL query
    const { user } = req.body; // Get user info from the request body

    if (!listingId || !ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: "Invalid or missing listing ID." });
    }

    const userId = user.auth0Id; // User's Auth0 ID
    const client = await clientPromise;
    const db = client.db("Auction");

    // Find the car
    const car = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(listingId) });

    if (!car || car.listingClosed) {
      return res
        .status(404)
        .json({ error: "Car Listing Not Found or Already Closed." });
    }

    // Update car details
    const carUpdateResult = await db.collection("cars").updateOne(
      { _id: new ObjectId(listingId) },
      {
        $set: {
          bidderId: userId,
          currBid: car.price,
          listingClosed: true,
        },
      }
    );

    if (carUpdateResult.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update car listing." });
    }

    // Fetch the user document
    const userDoc = await db.collection("users").findOne({ auth0Id: userId });
    if (!userDoc) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user arrays dynamically
    const updatedUserBids = (userDoc.userBids || []).filter(
      (id) => id !== listingId
    );
    const updatedUserPurchases = [...(userDoc.userPurchases || []), listingId];

    // Update user details
    const userUpdateResult = await db.collection("users").updateOne(
      { auth0Id: userId },
      {
        $set: {
          userBids: updatedUserBids,
          userPurchases: updatedUserPurchases,
        },
        $inc: { balance: -car.price }, // Deduct car price from user balance
      }
    );

    if (userUpdateResult.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update user details." });
    }

    res.status(200).json({
      message: "Checkout successful!",
      userBids: updatedUserBids,
      userPurchases: updatedUserPurchases,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
