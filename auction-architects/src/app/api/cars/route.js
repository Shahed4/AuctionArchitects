import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Auction");

    const body = await req.json();
    console.log("Incoming data:", body);

    if (
      !body.model ||
      !body.year ||
      !body.price ||
      !body.minBid ||
      !body.description
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newCar = {
      model: body.model,
      year: body.year,
      price: body.price,
      minBid: body.minBid,
      description: body.description,
      //images: body.images, // Add uploaded image URLs
      createdAt: new Date(),
    };

    await db.collection("cars").insertOne(newCar);

    return new Response(JSON.stringify({ message: "Car added successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error adding car:", error);
    return new Response(JSON.stringify({ error: "Failed to add car" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Auction");

    const cars = await db.collection("cars").find({}).toArray();
    return new Response(JSON.stringify(cars), { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cars" }), {
      status: 500,
    });
  }
}
