"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

export default function Profile() {
  // Mock data for the user's information and interested cars
  const userInfo = {
    name: "Rafid Rahman",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "1234 Elm Street, Springfield, USA",
  };

  const interestedCars = [
    {
      id: 1,
      model: "Toyota Camry 2023",
      price: "$25,000",
      image: "/camry.avif",
    },
    {
      id: 2,
      model: "Honda Accord 2022",
      price: "$24,500",
      image: "/accord.jpg",
    },
    { id: 3, model: "Tesla Model 3", price: "$35,000", image: "/tasla.jpg" },
  ];

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", py: 5 }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", color: "#e0e0e0" }}
        >
          Profile
        </Typography>

        {/* User Information */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 4,
            backgroundColor: "#1a1a1a",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: "#1976d2" }}>
            {userInfo.name[0]}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#e0e0e0" }}
            >
              {userInfo.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
              {userInfo.email}
            </Typography>
            <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
              {userInfo.phone}
            </Typography>
            <Typography variant="body1" sx={{ color: "#bdbdbd" }}>
              {userInfo.address}
            </Typography>
          </Box>
        </Box>

        {/* Interested Cars Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 2, color: "#e0e0e0" }}>
          Cars Marked as Interested
        </Typography>
        <Grid container spacing={3}>
          {interestedCars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card sx={{ backgroundColor: "#1a1a1a", color: "#fff" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={car.image} // Replace with the actual image path
                  alt={`${car.model}`}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ color: "#e0e0e0" }}>
                    {car.model}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                    {car.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
