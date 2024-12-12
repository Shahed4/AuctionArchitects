import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {
    // Extract the ID from the context parameters
    const params = await context.params;
    const { id } = params;

    // Validate the ID before using it
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid car ID" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("Auction");

    // Fetch car by its ObjectId
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });

    if (!car) {
      return new Response(JSON.stringify({ error: "Car not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(car), { status: 200 });
  } catch (error) {
    console.error("Error fetching car details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch car details" }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    console.log("Received params:", params);
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      console.error("Invalid ID received:", id);
      return new Response(
        JSON.stringify({ error: "Invalid or missing car ID." }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Auction");

    // Fetch the current state of the listing
    const car = await db.collection("cars").findOne({ _id: new ObjectId(id) });
    if (!car) {
      return new Response(
        JSON.stringify({ error: "Car not found." }),
        { status: 404 }
      );
    }

    // Toggle the showListing field
    const newShowListingState = !car.showListing;

    const result = await db.collection("cars").updateOne(
      { _id: new ObjectId(id) },
      { $set: { showListing: newShowListingState } }
    );

    console.log("MongoDB Update Result:", result);

    if (result.modifiedCount === 0) {
      console.error("No documents were updated for ID:", id);
      return new Response(
        JSON.stringify({ error: "Failed to update showListing." }),
        { status: 500 }
      );
    }

    const updatedCar = await db.collection("cars").findOne({
      _id: new ObjectId(id),
    });

    return new Response(
      JSON.stringify({
        message: "showListing state toggled successfully.",
        car: updatedCar,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
