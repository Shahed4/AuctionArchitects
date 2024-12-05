"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Container, Typography, Button, CardMedia } from "@mui/material";

export default function CheckoutPage() {
  const { id } = useParams(); // Dynamically resolve params
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error("Failed to fetch car details");
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car._id,
          price: car.price,
          description: car.description,
          model: car.model,
          //imageUrl: car.images?.[0] || "", // Pass the first image URL if available
        }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Checkout error:", data.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#000",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#000",
        }}
      >
        <Typography>Car details not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold" }}>
          Checkout for {car.model}
        </Typography>

        {/* Display Car Image */}
        {car.images && car.images.length > 0 && (
          <CardMedia
            component="img"
            image={car.images[0]} // Display the first image
            alt={`${car.model} image`}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              mb: 4,
            }}
          />
        )}

        <Typography variant="h5" sx={{ mb: 2 }}>
          Price: ${car.price}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Description: {car.description}
        </Typography>

        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </Container>
    </Box>
  );
}
