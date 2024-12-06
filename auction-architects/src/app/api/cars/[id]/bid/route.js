import clientPromise from "../../../../../../lib/mongodb"; // Update this with your MongoDB connection file
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { user, id, amount } = await req.json(); // Bid amount

    // Validate id
    if (!id || !ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing car ID." }),
        { status: 400 }
      );
    }

    const userId = user.sub; // Auth0 user ID
    const client = await clientPromise;

    const db = client.db("Auction");

    // Find the car
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });

    if (!car || !car.showListing || car.listingClosed) {
      return new Response(
        JSON.stringify({ error: "Car Listing Not Found/Available." }),
        {
          status: 404,
        }
      );
    }

    // If Lisiting Closed Due to Time, We need to Update
    if (new Date(car.endTime) <= Date.now()) {
      const updatedCar = await db.collection("cars").findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: { listingClosed: true },
        },
        { returnDocument: "after" }
      );

      return new Response(JSON.stringify({ error: "Bidding is Closed" }), {
        status: 400,
      });
    }

    // Bidding Price Requirements
    if (car.currBid >= car.price) {
      return new Response(JSON.stringify({ error: "Bidding is Closed" }), {
        status: 400,
      });
    }

    if (car.numBids == 0 && amount < car.currBid) {
      return new Response(
        JSON.stringify({ error: "Bid must be higher than the current price" }),
        { status: 400 }
      );
    } else if (amount < car.currBid + 500) {
      return new Response(
        JSON.stringify({
          error: "Bid must be $500 higher than the current price",
        }),
        { status: 400 }
      );
    }

    // Update the car's bid data
    const updatedCar = await db.collection("cars").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: { currBid: parseFloat(amount), bidderId: userId },
        $inc: { numBids: 1 },
        $push: { bids: { userId, amount, timestamp: new Date() } },
      },
      { returnDocument: "after" }
    );

    if (!updatedCar) {
      return new Response(
        JSON.stringify({ error: "Failed to Update Car Listing" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(updatedCar), { status: 200 });
  } catch (error) {
    console.error("Error handling bid:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
