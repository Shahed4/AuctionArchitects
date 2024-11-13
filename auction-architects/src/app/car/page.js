"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
} from "@mui/material";

export default function CarDetail() {
  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <Container maxWidth="100%" sx={{ py: 5, px: 3, color: "#fff" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}
        >
          Toyota Camry 2023
        </Typography>

        <Box sx={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          {/* Car Image */}
          <Card
            sx={{ width: 400, boxShadow: "0px 8px 16px rgba(255,255,255,0.1)" }}
          >
            <CardMedia
              component="img"
              height="400"
              image="/camry.avif" // Replace with actual image path
              alt="Toyota Camry"
            />
          </Card>

          {/* Car Information */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 2, color: "#e0e0e0" }}
            >
              2023 Toyota Camry SE
            </Typography>
            <Typography variant="h6" color="#bdbdbd" paragraph>
              Price: $28,500
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#f5f5f5" }}>
              <strong>Overview:</strong> The 2023 Toyota Camry SE is a stylish
              and fuel-efficient sedan, known for its reliability and smooth
              handling. Equipped with modern technology and safety features,
              it’s ideal for both city and highway driving.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#cfcfcf", fontWeight: "bold", mb: 1 }}
            >
              Specifications:
            </Typography>
            <Box
              component="ul"
              sx={{ listStyleType: "disc", pl: 4, color: "#bdbdbd", mb: 3 }}
            >
              <li>Engine: 2.5L 4-cylinder</li>
              <li>Horsepower: 203 hp</li>
              <li>Fuel Economy: 28 MPG city / 39 MPG highway</li>
              <li>Transmission: 8-speed automatic</li>
              <li>Drivetrain: Front-wheel drive</li>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#cfcfcf", fontWeight: "bold", mb: 1 }}
            >
              Features:
            </Typography>
            <Box
              component="ul"
              sx={{ listStyleType: "disc", pl: 4, color: "#bdbdbd" }}
            >
              <li>Apple CarPlay and Android Auto</li>
              <li>Adaptive cruise control</li>
              <li>Lane departure warning</li>
              <li>Rearview camera</li>
              <li>10 airbags for enhanced safety</li>
            </Box>

            {/* Actions */}
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                Place a Bid
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "#1976d2", borderColor: "#1976d2" }}
              >
                Purchase Car
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
