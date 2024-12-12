import clientPromise from "../../../../../lib/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // This is the `auth0Id` passed in the URL

  console.log("Request received:", { method, id, body: req.body });

  if (method !== "POST") {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  try {
    // Decode the ID to handle URL-encoded characters
    const decodedId = decodeURIComponent(id);

    // Parse the request body
    const body = req.body || {};
    const action = body.action; // Action can be "deposit" or "withdraw"
    const amount = body.amount;

    // Validate user ID
    if (typeof decodedId !== "string" || decodedId.trim() === "") {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Validate action
    if (!action || !["deposit", "withdraw"].includes(action)) {
      return res.status(400).json({ error: "Invalid or missing action" });
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const client = await clientPromise;
    const db = client.db("Auction");

    // Fetch the user by `auth0Id`
    const user = await db.collection("users").findOne({ auth0Id: decodedId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure sufficient balance for withdrawal
    if (action === "withdraw" && user.balance < numericAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Calculate the updated balance
    const updatedBalance =
      action === "deposit"
        ? user.balance + numericAmount
        : user.balance - numericAmount;

    // Update the user's balance in the database
    const result = await db
      .collection("users")
      .updateOne({ auth0Id: decodedId }, { $set: { balance: updatedBalance } });

    if (result.modifiedCount === 0) {
      return res.status(500).json({ error: "Failed to update balance" });
    }

    // Fetch the updated user information
    const updatedUser = await db.collection("users").findOne({ auth0Id: decodedId });

    // Return the updated balance and user information
    return res.status(200).json({ balance: updatedUser.balance, user: updatedUser });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
