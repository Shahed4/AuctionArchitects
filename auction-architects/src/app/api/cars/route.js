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
    const { user, formData } = await req.json();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "SignIn Required To Create Listing." }),
        { status: 400 }
      );
    }

    const userId = user.sub;

    // Validate required fields
    const requiredFields = [
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
      if (!formData[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    if (formData.year < 1900 || formData.year > new Date().getFullYear()) {
      return new Response(
        JSON.stringify({ error: "Invalid year. Please provide a valid year." }),
        { status: 400 }
      );
    }

    const newCar = {
      // IDs
      sellerId: userId,
      bidderId: null,

      // Seller Info
      name: formData.name,
      address: formData.address,
      phone: formData.phone,

      // Basic Car Info
      vin: formData.vin || null,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      color: formData.color,
      type: formData.type,
      description: formData.description,
      images: formData.images || [],

      // Bidding Info
      price: parseFloat(formData.price),
      minBid: parseFloat(formData.minBid),
      endTime: endTime(formData.endTime),
      currBid: parseFloat(formData.minBid),
      numBids: 0,

      // Accident Data
      accidentHistory: formData.accidentHistory || null,
      damageSeverity: formData.damageSeverity || null,
      pointOfImpact: formData.pointOfImpact || null,
      repairRecords: formData.repairRecords || null,
      airbagDeployment: formData.airbagDeployment || null,
      structuralDamage: formData.structuralDamage || null,

      // Service History (Short-Term)
      oilChanges: formData.oilChanges || null,
      tireRotations: formData.tireRotations || null,
      coolant: formData.coolant || null,
      airFilter: formData.airFilter || null,
      tirePressureDepth: formData.tirePressureDepth || null,
      lights: formData.lights || null,

      // Service History (Long-Term)
      transmissionReplaced: formData.transmissionReplaced || null,
      transferCaseFluid: formData.transferCaseFluid || null,
      shocksStruts: formData.shocksStruts || null,
      coolantFluidExchange: formData.coolantFluidExchange || null,
      sparkPlugs: formData.sparkPlugs || null,
      serpentineBelt: formData.serpentineBelt || null,
      differential: formData.differential || null,

      // Ownership History
      typeOfUse: formData.typeOfUse || null,
      previousOwners: formData.previousOwners || null,
      ownershipStates: formData.ownershipStates || null,
      ownershipLength: formData.ownershipLength || null,
      currentOdometerReading: formData.currentOdometerReading || null,
      floodOrLemonTitle: formData.floodOrLemonTitle || null,

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
