"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CheckoutPage() {
  const { id } = useParams(); // Dynamically resolve params
  const [car, setCar] = useState(null);
  const [bidAmount, setBidAmount] = useState(""); // To store the bid amount
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
        }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Checkout error:", data.error);
        alert(data.error || "Checkout failed.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    }
  };

  const handleBid = async () => {
    if (car.numBids == 0 && bidAmount < car.currBid) {
      alert("Must place a bid above starting bid.");
      return;
    } else if (car.numBids != 0 && bidAmount < car.currBid + 500) {
      alert("Must place a bid of at least $500 more than current bid.");
      return;
    }

    try {
      const response = await fetch(`/api/cars/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: car._id, amount: bidAmount }),
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
          backgroundColor: "#000",
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
          backgroundColor: "#000",
        }}
      >
        <Typography>Car details not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vh",
        color: "#fff",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Typography
          textAlign="center"
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#e0e0e0",
          }}
        >
          {car.year} {car.make} {car.model}
        </Typography>

        <Grid container spacing={2}>
          {/* Image Section */}
          <Grid item xs={12} md={8}>
            {car.images?.length ? (
              <CardMedia
                component="img"
                image={car.images[0]}
                alt={`${car.model} image`}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
                  mb: 4,
                }}
              />
            ) : (
              <Typography sx={{ color: "#e0e0e0", mb: 4 }}>
                No images attached.
              </Typography>
            )}
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#1a1a1a",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ mb: 2, color: "#fff" }}
              >
                Contact Information
              </Typography>
              <Typography>
                <strong>Name:</strong> {car.name || "Not provided"}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {car.phone || "Not provided"}
              </Typography>
              <Typography>
                <strong>Area:</strong> {car.address || "Not provided"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Description Section */}
        <Box>
          <Typography sx={{ mt: 3 }}>{car.description}</Typography>
        </Box>

        {/* Pricing Information */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: "#fff" }}>
          Minimum Bid: ${car.minBid || "N/A"}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
          Buy Now Price: ${car.price || "N/A"}
        </Typography>

        {/* Accordion Sections */}
        <Grid container spacing={2}>
          {[
            { title: "Accident Data", details: car.accidentHistory },
            { title: "Service History", details: car.oilChanges },
            { title: "Ownership History", details: car.previousOwners },
          ].map((section, index) => (
            <Grid key={index} item xs={12} md={4}>
              <Accordion
                disableGutters
                sx={{
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                >
                  <Typography>{section.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{section.details || "N/A"}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>

        {(!car.listingClosed || !car.showListing) && (
          <>
            {/* Bid and Buy Now Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                mb: 3,
              }}
            >
              {/* Bid Input */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                  label="Enter Bid Amount"
                  type="number"
                  variant="outlined"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    width: "200px",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#1a1a1a",
                      color: "#fff",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleBid}
                  sx={{
                    backgroundColor: "#4caf50",
                    "&:hover": { backgroundColor: "#388e3c" },
                  }}
                >
                  Place Bid
                </Button>
              </Box>

              {/* Buy Now Button */}
              <Button
                variant="contained"
                onClick={handleCheckout}
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": { backgroundColor: "#1565c0" },
                }}
              >
                Buy Now
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
