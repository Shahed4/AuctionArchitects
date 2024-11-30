"use client";
import React, { useState } from "react";
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

  // Mock car data
  const carList = [
    {
      id: 1,
      model: "Toyota Camry",
      year: 2023,
      price: 25000,
      minBid: 20000,
      image: "/camry.avif",
    },
    {
      id: 2,
      model: "Honda Accord",
      year: 2022,
      price: 24500,
      minBid: 21000,
      image: "/accord.jpg",
    },
    {
      id: 3,
      model: "Tesla Model 3",
      year: 2021,
      price: 35000,
      minBid: 30000,
      image: "/tesla.jpg",
    },
    {
      id: 4,
      model: "Ford Mustang",
      year: 2020,
      price: 40000,
      minBid: 35000,
      image: "/mustang.avif",
    },
  ];

  // State to manage filter inputs and filtered cars
  const [filters, setFilters] = useState({
    model: "",
    year: "",
    price: "",
    minBid: "",
  });
  const [filteredCars, setFilteredCars] = useState(carList);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply filters when the "Filter" button is clicked
  const applyFilters = () => {
    const filtered = carList.filter((car) => {
      return (
        (filters.model
          ? car.model.toLowerCase().includes(filters.model.toLowerCase())
          : true) &&
        (filters.year ? car.year.toString() === filters.year : true) &&
        (filters.price ? car.price <= parseFloat(filters.price) : true) &&
        (filters.minBid ? car.minBid <= parseFloat(filters.minBid) : true)
      );
    });
    setFilteredCars(filtered);
  };

  // Handle card click to navigate to car details
  const handleCardClick = (carId) => {
    router.push(`/car?id=${carId}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#000",
        minHeight: "100vw",
        width: "100vw",
        color: "#fff",
        py: 0,
        px: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ p: 0 }}>
        {/* Navigation Bar */}
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
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
        <Box sx={{ backgroundColor: "#000", py: 10, width: "100%" }}>
          <Typography variant="h4" gutterBottom>
            Car Auctions
          </Typography>

          {/* Filter Options */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              label="Model"
              variant="outlined"
              size="small"
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Year"
              variant="outlined"
              size="small"
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" } }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Price (Max)"
              variant="outlined"
              size="small"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <TextField
              label="Minimum Bidding Price (Max)"
              variant="outlined"
              size="small"
              name="minBid"
              value={filters.minBid}
              onChange={handleFilterChange}
              InputLabelProps={{ style: { color: "#fff" } }}
              InputProps={{ style: { color: "#fff" }, type: "number" }}
              sx={{ fieldset: { borderColor: "#fff" } }}
            />
            <Button
              variant="contained"
              onClick={applyFilters}
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            >
              Filter
            </Button>
          </Box>

          {/* Filtered Car Cards */}
          <Grid container spacing={3}>
            {filteredCars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    cursor: "pointer",
                    backgroundColor: "#1a1a1a",
                  }}
                  onClick={() => handleCardClick(car.id)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={car.image} // Replace with actual image path
                    alt={`${car.model}`}
                  />
                  <CardContent>
                    <Typography variant="h6">{car.model}</Typography>
                    <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                      Year: {car.year} | Price: ${car.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bdbdbd" }}>
                      Minimum Bid: ${car.minBid}
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
