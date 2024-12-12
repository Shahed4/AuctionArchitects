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
