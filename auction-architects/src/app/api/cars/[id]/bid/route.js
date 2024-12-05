import { clientPromise } from "../../../../../../lib/mongodb"; // Update this with your MongoDB connection file
import { getSession } from "@auth0/nextjs-auth0";

export async function POST(req, { params }) {
  try {
    const { id } = params; // Car ID
    const { amount } = await req.json(); // Bid amount
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.sub; // Auth0 user ID
    const { db } = await clientPromise();

    // Find the car
    const car = await db.collection("cars").findOne({ _id: id });

    if (!car) {
      return new Response(JSON.stringify({ error: "Car not found" }), {
        status: 404,
      });
    }

    // Ensure bid is higher than the current bid
    if (amount < Math.max(500, car.currentBid || 0)) {
      return new Response(
        JSON.stringify({ error: "Bid must be higher than the current price" }),
        { status: 400 }
      );
    }

    // Update the car's bid data
    const updatedCar = await db.collection("cars").findOneAndUpdate(
      { _id: id },
      {
        $set: { currentBid: amount },
        $push: { bids: { userId, amount, timestamp: new Date() } },
      },
      { returnDocument: "after" }
    );

    return new Response(JSON.stringify(updatedCar), { status: 200 });
  } catch (error) {
    console.error("Error handling bid:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
