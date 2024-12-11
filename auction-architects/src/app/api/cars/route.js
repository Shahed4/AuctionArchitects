import clientPromise from "../../../../lib/mongodb";

const endTime = (option) => {
  let currentDate = new Date(); // Start with the current date

  switch (option) {
    case "3 Days":
      currentDate.setDate(currentDate.getDate() + 3);
      break;
    case "5 Days":
      currentDate.setDate(currentDate.getDate() + 5);
      break;
    case "1 Week":
      currentDate.setDate(currentDate.getDate() + 7);
      break;
    case "2 Weeks":
      currentDate.setDate(currentDate.getDate() + 14);
      break;
    case "1 Month":
      currentDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      currentDate.setDate(currentDate.getDate() + 14);
  }

  return currentDate;
};

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("Auction");

    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "address",
      "phone",
      "make",
      "model",
      "year",
      "color",
      "type",
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

    if (body.year < 1900 || body.year > new Date().getFullYear()) {
      return new Response(
        JSON.stringify({ error: "Invalid year. Please provide a valid year." }),
        { status: 400 }
      );
    }

    const newCar = {
      // Personal/Basic Info
      name: body.name,
      address: body.address,
      phone: body.phone,
      vin: body.vin || null,
      make: body.make,
      model: body.model,
      year: body.year,
      color: body.color,
      type: body.type,
      price: parseFloat(body.price),
      minBid: parseFloat(body.minBid),
      endTime: endTime(body.endTime),
      currBid: parseFloat(body.minBid),
      bidderId: null,
      numBids: 0,
      description: body.description,
      images: body.images || [],
      
      // Accident Data
      accidentHistory: body.accidentHistory || null,
      damageSeverity: body.damageSeverity || null,
      pointOfImpact: body.pointOfImpact || null,
      repairRecords: body.repairRecords || null,
      airbagDeployment: body.airbagDeployment || null,
      structuralDamage: body.structuralDamage || null,

      // Service History (Short-Term)
      oilChanges: body.oilChanges || null,
      tireRotations: body.tireRotations || null,
      coolant: body.coolant || null,
      airFilter: body.airFilter || null,
      tirePressureDepth: body.tirePressureDepth || null,
      lights: body.lights || null,

      // Service History (Long-Term)
      transmissionReplaced: body.transmissionReplaced || null,
      transferCaseFluid: body.transferCaseFluid || null,
      shocksStruts: body.shocksStruts || null,
      coolantFluidExchange: body.coolantFluidExchange || null,
      sparkPlugs: body.sparkPlugs || null,
      serpentineBelt: body.serpentineBelt || null,
      differential: body.differential || null,

      // Ownership History
      typeOfUse: body.typeOfUse || null,
      previousOwners: body.previousOwners || null,
      ownershipStates: body.ownershipStates || null,
      ownershipLength: body.ownershipLength || null,
      currentOdometerReading: body.currentOdometerReading || null,
      floodOrLemonTitle: body.floodOrLemonTitle || null,

      createdAt: new Date(),
      showListing: true,
      listingClosed: false,
      bids: [],
    };

    const result = await db.collection("cars").insertOne(newCar);

    return new Response(
      JSON.stringify({
        message: "Car added successfully",
        carId: result.insertedId,
        redirectTo: `/car/${result.insertedId}`,
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
