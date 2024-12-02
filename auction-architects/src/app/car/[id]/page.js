"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Button } from "@mui/material";

export default function CarDetails({ params }) {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null); // Store the unwrapped `id`

  // Unwrap `params` using React.use()
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    };

    unwrapParams();
  }, [params]);

  // Fetch car details after `id` is unwrapped
  useEffect(() => {
    if (!id) return;

    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error("Failed to fetch car details");
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#fff",
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
          color: "#fff",
        }}
      >
        <Typography>Car not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold" }}>
          {car.model} ({car.year})
        </Typography>
        <Box>
          <Typography variant="h6">Description:</Typography>
          <Typography>{car.description}</Typography>
        </Box>
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            onClick={() => router.push(`/checkout/${id}`)}
          >
            Buy Now
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
          >
            Bid
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
