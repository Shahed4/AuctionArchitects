import clientPromise from "../../../../../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

export async function POST(req) {
  // Initialize Stripe client lazily to avoid build-time errors
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { user, id, amount } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing car ID." }),
        { status: 400 }
      );
    }

    const userId = user.sub;
    const client = await clientPromise;
    const db = client.db("Auction");

    // Find the car
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });

    if (!car || !car.showListing || car.listingClosed) {
      return new Response(
        JSON.stringify({ error: "Car Listing Not Found/Available." }),
        { status: 404 }
      );
    }

    // Check if listing has closed due to time
    if (new Date(car.endTime) <= Date.now()) {
      await db.collection("cars").updateOne(
        { _id: new ObjectId(id) },
        { $set: { listingClosed: true } }
      );
      return new Response(JSON.stringify({ error: "Bidding is Closed" }), {
        status: 400,
      });
    }

    const bidAmount = parseFloat(amount);
    const currentBid = parseFloat(car.currBid);
    const bidDifference = car.price - currentBid;

    // Check if bid equals "Buy Now" price
    if (bidAmount === car.price) {
      const result = await db.collection("cars").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { showListing: false, listingClosed: true, bidderId: userId },
          $push: { bids: { userId, amount: bidAmount, timestamp: new Date() } },
        }
      );

      if (result.modifiedCount === 0) {
        return new Response(
          JSON.stringify({ error: "Failed to Update Car Listing" }),
          { status: 500 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${car.year} ${car.make} ${car.model}`,
                description: car.description || "No description provided.",
              },
              unit_amount: car.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      });

      return new Response(JSON.stringify({ url: session.url }), { status: 200 });
    }

    const increment = bidDifference > 1000 ? 500 : 100;

    if (bidAmount < currentBid + increment || bidAmount % increment !== 0) {
      return new Response(
        JSON.stringify({
          error: `Bid must be at least $${increment} higher than the current bid, in increments of $${increment}.`,
        }),
        { status: 400 }
      );
    }

    // Update the car's bid data
    const result = await db.collection("cars").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { currBid: bidAmount, bidderId: userId },
        $inc: { numBids: 1 },
        $push: { bids: { userId, amount: bidAmount, timestamp: new Date() } },
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to Update Car Listing" }),
        { status: 500 }
      );
    }

    const updatedCar = await db
      .collection("cars")
      .findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(updatedCar), { status: 200 });
  } catch (error) {
    console.error("Error handling bid:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
