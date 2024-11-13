"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCardClick = (carId) => {
    router.push(`/car?id=${carId}`);
  };

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
      <Container maxWidth="lg" sx={{ p: 0 }}>
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Auction Architects
            </Typography>
            <Button color="inherit">Sell</Button>
            <Button color="inherit">Sign In</Button>
            <Button color="inherit">Sign Up</Button>
          </Toolbar>
        </AppBar>

        {/* Background and Centered Title */}
        <Box
          sx={{
            backgroundImage: `url(/28803.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" gutterBottom>
            Welcome to Auction Architects!
          </Typography>
          <Typography variant="h6">
            Auction Architects allows you to create, manage, and bid on
            auctions.
          </Typography>
        </Box>

        {/* Auction Section with Filter and Car Cards */}
        <Box
          sx={{ backgroundColor: "#000", py: 10, width: "100%", color: "#fff" }}
        >
          <Typography variant="h4" gutterBottom>
            Car Auctions
          </Typography>

          {/* Filter Options */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Model"
              variant="outlined"
              size="small"
              sx={{
                input: { color: "#fff" },
                label: { color: "#fff" },
                fieldset: { borderColor: "#fff" },
              }}
            />
            <TextField
              label="Date"
              variant="outlined"
              size="small"
              sx={{
                input: { color: "#fff" },
                label: { color: "#fff" },
                fieldset: { borderColor: "#fff" },
              }}
            />
            <TextField
              label="Price"
              variant="outlined"
              size="small"
              sx={{
                input: { color: "#fff" },
                label: { color: "#fff" },
                fieldset: { borderColor: "#fff" },
              }}
            />
          </Box>

          {/* Car Cards */}
          <Grid container spacing={3}>
            {Array.from({ length: 20 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    maxWidth: 345,
                    cursor: "pointer",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                  }}
                  onClick={() => handleCardClick(index + 1)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image="/camry.avif" // Placeholder image path
                    alt="Car image"
                  />
                  <CardContent>
                    <Typography variant="h6">Car Model {index + 1}</Typography>
                    <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                      Year: 2023 | Price: $25,000
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
