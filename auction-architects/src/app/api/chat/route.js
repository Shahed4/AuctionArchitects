import { OpenAI } from "openai";

export async function POST(req) {
  // Initialize OpenAI client lazily to avoid build-time errors
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new Response(JSON.stringify({ error: "Missing messages" }), {
        status: 400,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    return new Response(
      JSON.stringify({ response: completion.choices[0].message }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch AI response" }),
      { status: 500 }
    );
  }
}
