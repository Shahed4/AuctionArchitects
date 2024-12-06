import clientPromise from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Auction");

    // Parse and log incoming request body
    const body = await req.json();
    console.log("Incoming data:", body);

    // Validate required fields
    const requiredFields = [
      "name",
      "address",
      "phone",
      "model",
      "year",
      "price",
      "minBid",
      "description",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Construct new car object
    const newCar = {
      name: body.name,
      address: body.address,
      phone: body.phone,
      make: body.make,
      model: body.model,
      year: body.year,
      color: body.color,
      type: body.type,
      price: parseFloat(body.price),
      minBid: parseFloat(body.minBid),
      currBid: 0,
      bidderID: null,
      numBids: 0,
      description: body.description,
      images: body.images || [], // Add uploaded image URLs if available
      accidentHistory: body.accidentHistory || null,
      damageSeverity: body.damageSeverity || null,
      pointOfImpact: body.pointOfImpact || null,
      repairRecords: body.repairRecords || null,
      airbagDeployment: body.airbagDeployment || null,
      structuralDamage: body.structuralDamage || null,
      oilChanges: body.oilChanges || null,
      tireRotations: body.tireRotations || null,
      openRecalls: body.openRecalls || null,
      brakeRotorReplaced: body.brakeRotorReplaced || null,
      transmissionReplaced: body.transmissionReplaced || null,
      safetyInspections: body.safetyInspections || null,
      previousOwners: body.previousOwners || null,
      ownershipStates: body.ownershipStates || null,
      ownershipLength: body.ownershipLength || null,
      lastReportedMileage: body.lastReportedMileage || null,
      currentOdometerReading: body.currentOdometerReading || null,
      floodOrLemonTitle: body.floodOrLemonTitle || null,
      createdAt: new Date(),
      showListing: true,
      listingClosed: false,
    };

    // Insert car into the database
    const result = await db.collection("cars").insertOne(newCar);

    return new Response(
      JSON.stringify({
        message: "Car added successfully",
        carId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding car:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add car. Please try again." }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Auction");

    // Fetch all cars from the database
    const cars = await db.collection("cars").find({}).toArray();

    return new Response(JSON.stringify(cars), { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cars. Please try again." }),
      { status: 500 }
    );
  }
}
