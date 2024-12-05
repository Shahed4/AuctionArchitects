import { handleAuth } from "@auth0/nextjs-auth0";

// Named export for GET method
export const GET = async (req) => {
  try {
    // Handle the callback with Auth0
    const response = await handleAuth()(req);

    // Ensure a response is returned
    if (!response) {
      throw new Error("No response returned from Auth0 handler");
    }

    return response;
  } catch (error) {
    console.error("Error in Auth0 callback:", error.message);
    return new Response(JSON.stringify({ error: "Callback failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
