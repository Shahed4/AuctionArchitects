"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  CardMedia,
  TextField,
} from "@mui/material";

export default function CarDetails({ params: initialParams }) {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);

  // Unwrap `params` asynchronously
  useEffect(() => {
    const unwrapParams = async () => {
      if (initialParams) {
        const resolvedParams = await initialParams;
        setId(resolvedParams.id);
      }
    };

    unwrapParams();
  }, [initialParams]);

  // Fetch car details after `id` is set
  useEffect(() => {
    if (!id) return;

    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error("Failed to fetch car details");
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleBid = async () => {
    if (bidAmount <= 0) {
      alert("Bid amount must be greater than 0!");
      return;
    }

    try {
      const response = await fetch(`/api/cars/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: bidAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to place bid");
      }

      const updatedCar = await response.json();
      setCar(updatedCar);
      alert("Bid placed successfully!");
    } catch (error) {
      alert(error.message || "An error occurred while placing the bid.");
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

        {/* Display Car Images */}
        {car.images && car.images.length > 0 ? (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {car.images.map((image, index) => (
              <Grid item xs={12} key={index}>
                <CardMedia
                  component="img"
                  image={image}
                  alt={`Car image ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No images available for this car.</Typography>
        )}

        <Box>
          <Typography variant="h6">Description:</Typography>
          <Typography>{car.description}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Current Bid:</Typography>
          <Typography variant="body1">
            ${car.currentBid || "No bids yet"}
          </Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            onClick={() => router.push(`/checkout/${id}`)}
          >
            Buy Now
          </Button>

          <Typography variant="h6">Place Your Bid:</Typography>
          <TextField
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            label="Enter bid amount"
            variant="outlined"
            sx={{ input: { color: "#fff" }, fieldset: { borderColor: "#fff" } }}
            InputLabelProps={{ style: { color: "#fff" } }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            onClick={handleBid}
          >
            Submit Bid
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
