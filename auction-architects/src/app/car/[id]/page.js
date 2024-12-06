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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}>
      <Container maxWidth="lg">
        <Typography textAlign="center" variant="h3" sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}>
          Checkout for {car.model}
        </Typography>

        <Grid container spacing={2}>
          {/* Image Section */}
          <Grid item xs={12} md={8}>
            {car.images && car.images.length > 0 ? (
              <CardMedia
                component="img"
                image={car.images[0]} // Display the first image
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
                padding: 2,
                borderRadius: 2,
                boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Typography variant="h6" textAlign={"center"} sx={{ mb: 2, color: "#fff" }}>
                Contact Information
              </Typography>
              <Typography>
                <strong>Name:</strong> {car.name || "Not provided"}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {car.phone || "Not provided"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Pricing Information */}
        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: "#fff" }}>
          Minimum Bid: ${car.minBid || "N/A"}
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: "#fff" }}>
          Buy Now Price: ${car.price || "N/A"}
        </Typography>

        {/* Accordion Sections in Columns */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                "&:not(.Mui-expanded)": {
                  boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Accident Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>History: {car.accidentHistory || "N/A"}</Typography>
                {car.accidentHistory === "yes" && (
                  <>
                    <Typography>Damage Severity: {car.damageSeverity}</Typography>
                    <Typography>Point of Impact: {car.pointOfImpact}</Typography>
                    <Typography>Airbag Deployment: {car.airbagDeployment}</Typography>
                    <Typography>Structural Damage: {car.structuralDamage}</Typography>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={4}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                "&:not(.Mui-expanded)": {
                  boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Service History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Oil Changes: {car.oilChanges || "N/A"}</Typography>
                <Typography>Tire Rotations: {car.tireRotations || "N/A"}</Typography>
                <Typography>Open Recalls: {car.openRecalls || "N/A"}</Typography>
                <Typography>
                  Brake Rotor Replaced: {car.brakeRotorReplaced || "N/A"}
                </Typography>
                <Typography>
                  Transmission Replaced: {car.transmissionReplaced || "N/A"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12} md={4}>
            <Accordion
              disableGutters
              sx={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                "&:not(.Mui-expanded)": {
                  boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography>Ownership History</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Previous Owners: {car.previousOwners || "N/A"}</Typography>
                <Typography>
                  Ownership States: {car.ownershipStates || "N/A"}
                </Typography>
                <Typography>
                  Ownership Length: {car.ownershipLength || "N/A"}
                </Typography>
                <Typography>
                  Last Reported Mileage: {car.lastReportedMileage || "N/A"}
                </Typography>
                <Typography>
                  Current Odometer Reading: {car.currentOdometerReading || "N/A"}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          sx={{
            mt: 3,
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Proceed to Checkout
        </Button>
      </Container>
    </Box>
  );
}
